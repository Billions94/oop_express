import { User } from '../entity/user';
import { UserInput } from './userInput';
import { CreateUserResponse } from './createUserResponse';
import { UserResponse } from './userResponse';
import { DeleteResult } from 'typeorm';
import { LoginResponse } from './loginResponse';
import { DeleteUserResponse } from './deleteUserResponse';

export interface UserServiceInterface {
  createUser(userInput: UserInput): Promise<Partial<CreateUserResponse>>;
  login(email: string, password: string): Promise<Partial<LoginResponse>>
  getUsers(): Promise<User[]>;
  getUserById(id: number): Promise<Partial<UserResponse>>;
  updateUser(id: number, userInput: UserInput): Promise<Partial<UserResponse>>
  deleteUser(id: number): Promise<DeleteUserResponse>
}