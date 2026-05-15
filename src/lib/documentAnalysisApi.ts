/**
 * Document analysis (chats / sessions) — HTTP helpers with user-safe errors.
 * Call after each `fetch`; consumes error body on failure.
 */
import { throwIfNotOk } from "./apiClientErrors";

export async function daEnsureOk(
  res: Response,
  logContext: string,
  userFallback: string
): Promise<void> {
  await throwIfNotOk(res, logContext, { default: userFallback });
}
