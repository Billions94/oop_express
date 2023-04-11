import { User } from '../entity/user';

export  interface UserResponse {
  statusCode?: number;
  message?: string;
  errorMessage?: string;
  data: {
    user: User | null
  }
}