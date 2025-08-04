import { API_BASE_URL } from "../app/constants";

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
      throw new Error(`Validation error: ${errorData.detail.map(err => err.msg).join(', ')}`);
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}; 