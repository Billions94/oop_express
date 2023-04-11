import { UserRepository } from '../repository/userRepository';
import { User } from '../entity/user';
import { UserServiceInterface } from '../interfaces/userServiceInterface';
import { UserInput } from '../interfaces/userInput';
import { CreateUserResponse } from '../interfaces/createUserResponse';
import { Validator } from '../../utils/validators/validators';
import { UserResponse } from '../interfaces/userResponse';
import { CredentialManager } from '../../auth/credential/credentialManager';
import { JwtAuthService } from '../../auth/jwtAuth.service';
import { LoginResponse } from '../interfaces/loginResponse';
import bcryptService from 'bcrypt';
import dotenv from 'dotenv';
import * as process from 'process';
import { Service } from 'typedi';
import { DeleteResponse } from '../interfaces/deleteResponse';

dotenv.config();

@Service()
export class UserService implements UserServiceInterface {
  private readonly SALT_FACTOR = parseInt(<string>process.env.SALT_FACTOR);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtAuthService: JwtAuthService
  ) {}

  async createUser(userInput: UserInput): Promise<Partial<CreateUserResponse>> {
    try {
      Validator.validateInput(userInput);
      await Validator.isExistsByEmail(userInput.email);

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
        statusCode: 200,
        data: {
          id: user.id,
          accessToken,
          refreshToken,
        },
      };
    } catch (e) {
      return {
        statusCode: e.statusCode,
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
    return { accessToken, refreshToken };
  }

  async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find();

    if (users !== null) {
      return users.map((user) => <User>user.getUserDetails());
    }
    return [];
  }

  async getUserById(id: number): Promise<Partial<UserResponse>> {
    try {
      await Validator.throwErrorIfNotExist(id);
      const user = await this.userRepository
        .findById(id)
        .then((u) => <User>u?.getUserDetails());

      return { statusCode: 200, data: { user } };
    } catch (e) {
      return {
        statusCode: e.statusCode,
        errorMessage: e.message,
        data: { user: null },
      };
    }
  }

  async updateUser(
    id: number,
    userInput: UserInput
  ): Promise<Partial<UserResponse>> {
    try {
      await Validator.throwErrorIfNotExist(id);
      await this.userRepository.update({ id: id }, userInput);
      const user = <User>(
        await this.userRepository.findById(id).then((u) => u?.getUserDetails())
      );
      user.updatedAt = new Date();
      await this.userRepository.save(user);

      return {
        statusCode: 200,
        message: 'User updated successfully',
        data: { user },
      };
    } catch (e) {
      return {
        statusCode: e.statusCode,
        errorMessage: e.message,
        data: {
          user: null,
        },
      };
    }
  }

  async deleteUser(id: number): Promise<DeleteResponse> {
    try {
      await Validator.throwErrorIfNotExist(id);
      await this.userRepository.deleteById(id);
      return { success: true };
    } catch (e) {
      return { success: false, errorMessage: e.message };
    }
  }
}
