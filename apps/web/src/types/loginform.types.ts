export interface User {
    cnic: string;
    email: string;
    full_name: string;
    user_id: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
    user: User;
}