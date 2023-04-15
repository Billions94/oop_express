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
import { Service } from 'typedi';
import { DeleteUserResponse } from '../interfaces/deleteUserResponse';
import { userResponseMapper } from '../mapper/response/userResponseMapper';
import { userRequestMapper } from '../mapper/request/userRequestMapper';
import { Inject } from 'typescript-ioc';

@Service()
export class UserService implements UserServiceInterface {
  @Inject
  private readonly userRepository: UserRepository;
  @Inject
  private readonly jwtAuthService: JwtAuthService;

  async createUser(userInput: UserInput): Promise<Partial<CreateUserResponse>> {
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

  async getUsers(): Promise<User[]> {
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
      return {
        statusCode: e.statusCode,
        success: false,
        errorMessage: e.message,
      };
    }
  }
}
