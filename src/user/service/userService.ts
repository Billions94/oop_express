import { UserRepository } from '../repository/userRepository';
import { User } from '../entity/user';
import { UserServiceInterface } from '../interfaces/userServiceInterface';
import { UserInput } from '../interfaces/userInput';
import { CreateUserResponse } from '../interfaces/createUserResponse';
import { Validator } from '../../utils/validators/validators';
import { UserResponse } from '../interfaces/userResponse';
import { DeleteResult } from 'typeorm';
import { CredentialManager } from '../../auth/credential/credentialManager';
import { JwtAuthService } from '../../auth/jwtAuth.service';
import { LoginResponse } from '../interfaces/loginResponse';
import bcryptService from 'bcrypt';
import dotenv from 'dotenv';
import * as process from 'process';
import { Container, Service } from 'typedi';

dotenv.config();

@Service()
export class UserService implements UserServiceInterface {
  private readonly userRepository: UserRepository;
  private readonly jwtAuthService: JwtAuthService;
  private readonly SALT_FACTOR = parseInt(<string>process.env.SALT_FACTOR);

  constructor() {
    this.userRepository = Container.get(UserRepository);
    this.jwtAuthService = Container.get(JwtAuthService);
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
      user.password = await bcryptService.hash(
        userInput.password,
        this.SALT_FACTOR
      );
      user.createdAt = new Date();

      const { accessToken, refreshToken } =
        await this.jwtAuthService.tokenGenerator(user);

      await this.userRepository.save(user);
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
        errorMessage: e.message,
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
    await this.userRepository.save(user);
    return { accessToken, refreshToken };
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find();

    if (users !== null) {
      return users.map((user) => user.getJSONObject() as User);
    }
    return [];
  }

  async getUserById(id: number): Promise<User> {
    return (
      ((await this.userRepository.findById(id))?.getJSONObject() as User) ||
      null
    );
  }

  async updateUser(
    id: number,
    userInput: UserInput
  ): Promise<Partial<UserResponse>> {
    try {
      await this.userRepository.update({ id: id }, userInput);
      const user = <User>await this.userRepository.findById(id);
      user.updatedAt = new Date();
      await this.userRepository.save(user);
      return {
        status: '200:ok success',
        errorMessage: 'User updated successfully',
        data: {
          user: <User>user.getJSONObject(),
        },
      };
    } catch (e) {
      return {
        status: '400: Bad Request',
        errorMessage: e.message,
        data: {
          user: null,
        },
      };
    }
  }

  async deleteUser(id: number): Promise<DeleteResult> {
    return this.userRepository.delete({ id });
  }
}
