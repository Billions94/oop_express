import { User } from '../entity/user';
import { UserInput } from './userInput';
import { CreateUserResponse } from './createUserResponse';
import { UserResponse } from './userResponse';
import { DeleteResult } from 'typeorm';
import { LoginResponse } from './loginResponse';

export interface UserServiceInterface {
  createUser(userInput: UserInput): Promise<Partial<CreateUserResponse>>;
  login(email: string, password: string): Promise<Partial<LoginResponse>>
  getUsers(): Promise<User[]>;
  getUserById(userId: number): Promise<User>;
  updateUser(userId: number, userInput: UserInput): Promise<Partial<UserResponse>>
  deleteUser(userId: number): Promise<DeleteResult>
}