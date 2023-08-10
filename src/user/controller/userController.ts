import { UserService } from '../service/userService';
import { Inject } from 'typescript-ioc';
import { RegisterUserInput } from '../interfaces/registerUserInput';
import {
  GET,
  Path,
  PathParam,
  POST,
  PATCH,
  DELETE,
  ContextRequest,
} from 'typescript-rest';
import { Request } from 'express';
import { User } from '../entity/user';
import { UserResponse } from '../interfaces/userResponse';
import { CreateUserResponse } from '../interfaces/createUserResponse';
import { LoginResponse } from '../interfaces/loginResponse';
import { DeleteUserResponse } from '../interfaces/deleteUserResponse';
import { LoginUserInput } from '../interfaces/loginUserInput';
import { UpdateUserInput } from '../interfaces/updateUserInput';
import { UserDto } from '../interfaces/userDto';

@Path('api/users')
export class UserController {
  @Inject
  private readonly userService: UserService;

  @GET
  async getUsers(): Promise<UserDto[]> {
    return this.userService.getUsers();
  }

  @GET
  @Path(':id')
  async getUserById(
    @PathParam('id') id: number
  ): Promise<Partial<UserResponse>> {
    return this.userService.getUserById(id);
  }

  @GET
  @Path('me')
  async getLoggedInUser(
    @ContextRequest { user, params }: Request
  ): Promise<Partial<UserResponse>> {
    console.log({ user, params });
    return this.userService.getLoggedInUser(<User>user);
  }

  @POST
  @Path('register')
  async registerUser(
    input: RegisterUserInput
  ): Promise<Partial<CreateUserResponse>> {
    return this.userService.createUser(input);
  }

  @POST
  @Path('login')
  async loginUser(input: LoginUserInput): Promise<Partial<LoginResponse>> {
    return this.userService.login(input.email, input.password);
  }

  @PATCH
  @Path(':id')
  async updateUser(
    @PathParam('id') id: number,
    input: UpdateUserInput
  ): Promise<Partial<UserResponse>> {
    return this.userService.updateUser(id, input);
  }

  @DELETE
  @Path(':id')
  async deleteUser(@PathParam('id') id: number): Promise<DeleteUserResponse> {
    return this.userService.deleteUser(id);
  }
}
