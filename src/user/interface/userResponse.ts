import { User } from '../entity/user';

export  interface UserResponse {
  status?: string | number;
  message?: string;
  data: {
    user: User | null
  }
}