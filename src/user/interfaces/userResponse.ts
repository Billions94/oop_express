import { UserDto } from './userDto';

export interface UserResponse {
  statusCode?: number;
  message?: string;
  errorMessage?: string;
  data: {
    user: UserDto | null;
  };
}
