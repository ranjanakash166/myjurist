/**
 * User-safe API errors: never surface raw backend bodies or HTTP diagnostics in UI.
 * Use {@link getUserFacingError} in catch blocks; throw {@link PublicApiError} from API helpers.
 */

export type HttpErrorCategory =
  | 'auth'
  | 'forbidden'
  | 'not_found'
  | 'validation'
  | 'rate_limit'
  | 'server'
  | 'client'
  | 'unknown';

/** Per-status overrides plus optional `default` when no category-specific override exists. */
export type PublicHttpMessageOverrides = Partial<Record<HttpErrorCategory, string>> & {
  default?: string;
};

export const USAGE_LIMIT_EXCEEDED_MESSAGE =
  'You have exhausted your usage limit.';

export function httpErrorCategory(status: number): HttpErrorCategory {
  if (status === 401) return 'auth';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 422) return 'validation';
  if (status === 429) return 'rate_limit';
  if (status >= 500 && status < 600) return 'server';
  if (status >= 400 && status < 500) return 'client';
  return 'unknown';
}

const DEFAULT_MESSAGES: Record<HttpErrorCategory, string> = {
  auth: 'Your session has expired. Please sign in again.',
  forbidden: "You don't have permission to do that.",
  not_found: 'We could not find what you asked for.',
  validation: 'Some information looks incorrect. Please check and try again.',
  rate_limit: 'Too many requests. Please wait a moment and try again.',
  server: 'Something went wrong on our end. Please try again shortly.',
  client: 'This action could not be completed. Please try again.',
  unknown: 'Something went wrong. Please try again.',
};

export class PublicApiError extends Error {
  readonly userMessage: string;
  readonly status?: number;

  constructor(userMessage: string, options?: { status?: number; cause?: unknown }) {
    super(userMessage);
    this.name = 'PublicApiError';
    this.userMessage = userMessage;
    this.status = options?.status;
    if (options?.cause !== undefined) {
      (this as Error & { cause?: unknown }).cause = options.cause;
    }
  }
}

export function logApiFailure(
  logContext: string,
  status: number | undefined,
  rawBody: string
): void {
  console.error(`[API] ${logContext}`, status ?? '(no status)', rawBody || '(empty body)');
}

function resolveMessage(
  status: number,
  messages?: PublicHttpMessageOverrides
): string {
  const cat = httpErrorCategory(status);
  if (messages?.[cat]) return messages[cat]!;
  if (messages?.default) return messages.default;
  return DEFAULT_MESSAGES[cat];
}

/** Log raw failure and throw {@link PublicApiError} with a safe message. */
export function throwPublicHttpError(
  logContext: string,
  status: number,
  rawBody: string,
  messages?: PublicHttpMessageOverrides
): never {
  logApiFailure(logContext, status, rawBody);
  const msg = resolveMessage(status, messages);
  throw new PublicApiError(msg, { status });
}

/** Prefer {@link PublicApiError}; otherwise return fallback (never trust arbitrary Error.message). */
export function getUserFacingError(err: unknown, fallback: string): string {
  if (err instanceof PublicApiError) return err.userMessage;
  return fallback;
}

/** Network / non-HTTP failures after logging. */
export function throwPublicNetworkError(
  logContext: string,
  cause: unknown,
  userMessage: string
): never {
  console.error(`[API] ${logContext}`, cause);
  throw new PublicApiError(userMessage, { cause });
}

/** Read response body as text for logging, then throw if not OK. */
export async function throwIfNotOk(
  response: Response,
  logContext: string,
  messages?: PublicHttpMessageOverrides
): Promise<void> {
  if (response.ok) return;
  const rawBody = await response.text().catch(() => '');
  throwPublicHttpError(logContext, response.status, rawBody, messages);
}
