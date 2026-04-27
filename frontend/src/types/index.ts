export type Role = 'ADMIN' | 'PM' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface LoginResponse {

  message: string;
  user: User;
  accessToken: string; 
}
