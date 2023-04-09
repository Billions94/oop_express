import { UserRepository } from '../repository/userRepository';
import { User } from '../entity/user';
import { UserServiceInterface } from '../interface/userServiceInterface';
import { UserInput } from '../interface/userInput';
import { CreateUserResponse } from '../interface/createUserResponse';
import { Validator } from '../../utils/validators/validators';
import { UserResponse } from '../interface/userResponse';
import { DeleteResult } from 'typeorm';
import { CredentialManager } from '../../auth/credential/credentialManager';
import { JwtAuthService } from '../../auth/jwtAuth.service';
import { LoginResponse } from '../interface/loginResponse';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import * as process from 'process';
dotenv.config();
export class UserService implements UserServiceInterface {
  private userRepository: UserRepository;
  private jwtAuthService: JwtAuthService;
  private bcryptService = bcrypt;
  private SALT_FACTOR = parseInt(<string>process.env.SALT_FACTOR);

  constructor() {
    this.userRepository = new UserRepository();
    this.jwtAuthService = new JwtAuthService();
  }

  async createUser(userInput: UserInput): Promise<Partial<CreateUserResponse>> {
    try {
      Validator.validateInput(userInput);
      const existingUser = (await this.userRepository.isExistByEmail(
        userInput.email
      )) as User;
      if (existingUser)
        Validator.isExistsByEmail(existingUser.email, userInput.email);

      const user: User = new User();
      user.name = userInput.name;
      user.age = userInput.age;
      user.email = userInput.email;
      user.password = await this.bcryptService.hash(
        userInput.password,
        this.SALT_FACTOR
      );

      await this.userRepository.save(user);
      const { accessToken, refreshToken } =
        await this.jwtAuthService.tokenGenerator(user);

      return {
        status: '200:ok success',
        data: {
          id: user.id,
          accessToken,
          refreshToken,
        },
      };
    } catch (e) {
      return {
        status: '400: Bad Request',
        message: e.message,
        data: { id: null, accessToken: null, refreshToken: null },
      };
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<Partial<LoginResponse>> {
    const user = await CredentialManager.verifyCredentials(email, password);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { accessToken, refreshToken } =
      await this.jwtAuthService.tokenGenerator(user);
    return { accessToken, refreshToken };
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(userId: number): Promise<User> {
    return (await this.userRepository.findById(userId)) as User;
  }

  async updateUser(
    userId: number,
    userInput: UserInput
  ): Promise<Partial<UserResponse>> {
    try {
      return {
        status: '200:ok success',
        message: 'User updated successfully',
        data: {
          user: <any>(
            await this.userRepository.update({ id: userId }, userInput)
          ),
        },
      };
    } catch (e) {
      return {
        status: '400: Bad Request',
        message: e.message,
        data: {
          user: null,
        },
      };
    }
  }

  async deleteUser(userId: number): Promise<DeleteResult> {
    return this.userRepository.deleteById(userId);
  }
}
