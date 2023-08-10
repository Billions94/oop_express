import { UserRepository } from '../repository/userRepository';
import { User } from '../entity/user';
import { UserServiceInterface } from '../interfaces/userServiceInterface';
import { RegisterUserInput } from '../interfaces/registerUserInput';
import { CreateUserResponse } from '../interfaces/createUserResponse';
import { Validator } from '../../utils/validators/validators';
import { UserResponse } from '../interfaces/userResponse';
import { CredentialManager } from '../../auth/credential/credentialManager';
import { JwtAuthService } from '../../auth/jwtAuth.service';
import { LoginResponse } from '../interfaces/loginResponse';
import { Service } from 'typedi';
import { DeleteUserResponse } from '../interfaces/deleteUserResponse';
import { userResponseMapper } from '../mapper/response/userResponseMapper';
import { userRequestMapper } from '../mapper/request/userRequestMapper';
import { Inject } from 'typescript-ioc';
import Logger from '../../utils/log/Logger';
import { UpdateUserInput } from '../interfaces/updateUserInput';
import { UserDto } from '../interfaces/userDto';

@Service()
export class UserService implements UserServiceInterface {
  @Inject
  private readonly userRepository: UserRepository;
  @Inject
  private readonly jwtAuthService: JwtAuthService;

  async createUser(
    userInput: RegisterUserInput
  ): Promise<Partial<CreateUserResponse>> {
    try {
      Validator.validateRegisterInput(userInput);
      await Validator.isExistsByEmail(userInput.email);

      const user = await userRequestMapper(userInput);
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
      Logger.info(e.message);
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
      return { errorMessage: 'Invalid email or password' };
    }

    const { accessToken, refreshToken } =
      await this.jwtAuthService.tokenGenerator(user);
    return { accessToken, refreshToken };
  }

  async getUsers(): Promise<UserDto[]> {
    return await this.userRepository
      .find()
      .then((users) => users.map(userResponseMapper));
  }

  async getUserById(id: number): Promise<Partial<UserResponse>> {
    try {
      await Validator.throwErrorIfNotExist(id, 'user');
      const user = await this.userRepository
        .findById(id)
        .then(userResponseMapper);

      return { statusCode: 200, data: { user } };
    } catch (e) {
      Logger.info(e.message);
      return {
        statusCode: e.statusCode,
        errorMessage: e.message,
        data: { user: null },
      };
    }
  }

  async getLoggedInUser(user: User): Promise<Partial<UserResponse>> {
    try {
      return {
        statusCode: 200,
        message: 'success',
        data: { user },
      };
    } catch (e) {
      Logger.info(e.message);
      return {
        statusCode: e.statusCode,
        errorMessage: e.message,
        data: { user: null },
      };
    }
  }

  async updateUser(
    id: number,
    userInput: UpdateUserInput
  ): Promise<Partial<UserResponse>> {
    try {
      Logger.info(userInput);
      await Validator.throwErrorIfNotExist(id, 'user');
      await this.userRepository.update(id, userInput);

      const user = <User>(
        await this.userRepository.findById(id).then(userResponseMapper)
      );
      await this.userRepository.save(user);

      return {
        statusCode: 200,
        message: 'User updated successfully',
        data: { user },
      };
    } catch (e) {
      Logger.info(e.message);
      return {
        statusCode: e.statusCode,
        errorMessage: e.message,
        data: {
          user: null,
        },
      };
    }
  }

  async deleteUser(id: number): Promise<DeleteUserResponse> {
    try {
      await Validator.throwErrorIfNotExist(id, 'user');
      await this.userRepository.deleteById(id);
      return { statusCode: 200, success: true };
    } catch (e) {
      Logger.info(e.message);
      return {
        statusCode: e.statusCode,
        success: false,
        errorMessage: e.message,
      };
    }
  }
}
