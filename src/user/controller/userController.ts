import { UserService } from '../service/userService';
import { Service } from 'typedi';
import { GET, Path, PathParam, POST, PATCH, DELETE } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { UserInput } from '../interfaces/userInput';
import { Router } from 'express';

@Service()
@Path('api/users')
export class UserController {
  @Inject
  private readonly userService: UserService;

  @GET
  async getUsers() {
    return this.userService.getUsers();
  }

  @GET
  @Path(':id')
  async getUserById(@PathParam('id') id: number) {
    return this.userService.getUserById(id);
  }

  @POST
  @Path('register')
  async registerUser(input: UserInput) {
    return this.userService.createUser(input);
  }

  @POST
  @Path('login')
  async loginUser(input: { email: string; password: string }) {
    return this.userService.login(input.email, input.password);
  }

  @PATCH
  @Path(':id')
  async updateUser(@PathParam('id') id: number, input: UserInput) {
    return this.userService.updateUser(id, input);
  }

  @DELETE
  @Path(':id')
  async deleteUser(@PathParam('id') id: number) {
    return this.userService.deleteUser(id);
  }

  init() {
    return Router()
  }
}
