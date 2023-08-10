import { RegisterUserInput } from './registerUserInput';
import { CreateUserResponse } from './createUserResponse';
import { UserResponse } from './userResponse';
import { LoginResponse } from './loginResponse';
import { DeleteUserResponse } from './deleteUserResponse';
import { UpdateUserInput } from './updateUserInput';
import { UserDto } from './userDto';

export interface UserServiceInterface {
  createUser(
    userInput: RegisterUserInput
  ): Promise<Partial<CreateUserResponse>>;
  login(email: string, password: string): Promise<Partial<LoginResponse>>;
  getUsers(): Promise<UserDto[]>;
  getUserById(id: number): Promise<Partial<UserResponse>>;
  updateUser(
    id: number,
    userInput: UpdateUserInput
  ): Promise<Partial<UserResponse>>;
  deleteUser(id: number): Promise<DeleteUserResponse>;
}
