import { API_BASE_URL } from "../app/constants";
import { logApiFailure, PublicApiError } from "./apiClientErrors";

export interface ContactFormData {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  contact_id: string;
  submitted_at: string;
}

export interface ValidationError {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

export const submitContactForm = async (formData: ContactFormData): Promise<ContactResponse> => {
  const response = await fetch(`${API_BASE_URL}/contact/submit`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    if (response.status === 422) {
      const errorData: ValidationError = await response.json();
      logApiFailure(
        'POST /contact/submit (validation)',
        response.status,
        errorData.detail.map((e) => e.msg).join('; ')
      );
      throw new PublicApiError(
        'Please check the form and try again. Some fields need your attention.',
        { status: response.status }
      );
    }
    const errorText = await response.text().catch(() => '');
    logApiFailure('POST /contact/submit', response.status, errorText);
    throw new PublicApiError('We could not send your message. Please try again shortly.', {
      status: response.status,
    });
  }

  return response.json();
}; 