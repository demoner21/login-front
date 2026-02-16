export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  job_title?: string;
  phone?: string;
  location?: string;
  country?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  tax_id?: string;
  role_id: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}