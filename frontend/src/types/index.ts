export type Role = 'ADMIN' | 'PM' | 'USER';

export interface User {
  id: string;
  name: string;
  emailid: string; 
  role: Role;
}

export interface LoginResponse {
  message: string;
  user: User;
  accessToken: string; 
}