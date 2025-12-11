
// Types
export interface RegisterFormData {
  full_name: string;
  email: string;
  cnic: string;
  gender: 'male' | 'female' | 'other';
  dob: string;
  password: string;
  confirm_password: string;
}

export interface UserResponse {
  message: string;
  user?: {
    id: string;
    email: string;
    full_name: string;
  };
}

