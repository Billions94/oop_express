import { User } from '../entity/user';

export  interface UserResponse {
  status?: string | number;
  errorMessage?: string;
  data: {
    user: User | null
  }
}