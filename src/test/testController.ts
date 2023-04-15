import 'reflect-metadata';
import { GET, PATCH, Path, PathParam, POST } from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { Router } from 'express';
import Logger from '../utils/log/Logger';
import { UserRepository } from '../user/repository/userRepository';
import { User } from '../user/entity/user';
import { Service } from 'typedi';

interface TestUser {
  id: number;
  name: string;
  email: string;
  age: number;
  posts: string[];
  spaces: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface TestUserInput
  extends Pick<TestUser, 'name' | 'email' | 'age' | 'posts' | 'spaces'> {}

@Service()
@Path('/test')
export class TestController {
  private readonly router: Router;
  @Inject
  private readonly userRepository: UserRepository;
  private inMemoryUsers: TestUser[] = [];

  constructor() {
    this.router = Router();
  }

  init() {
    return this.router;
  }

  @GET
  async users(): Promise<User[]> {
    return await this.userRepository.find();
  }

  @GET
  @Path(':id')
  userById(@PathParam('id') id: number): TestUser | { errorMessage: string } {
    const user = this.inMemoryUsers.find((user) => user.id === id);
    if (!this.inMemoryUsers.includes(<TestUser>user)) {
      return { errorMessage: 'User not found' };
    }
    return user as TestUser;
  }

  @POST
  createUser(input: TestUserInput): Partial<TestUser> {
    const user = {
      id: Math.ceil(Math.random() * 100),
      name: input.name,
      age: input.age,
      email: input.email,
      posts: input.posts,
      spaces: input.spaces,
      createdAt: new Date(),
    };

    this.inMemoryUsers = [...this.inMemoryUsers, user]
    return user;
  }

  @PATCH
  @Path(':id')
  updateUser(@PathParam('id') id: number, input: any) {
    const modifiedUser = this.inMemoryUsers.find(
      (user) => user.id === id
    ) as TestUser;
    modifiedUser.name = input.name;
    modifiedUser.age = input.age;
    modifiedUser.email = input.email;
    modifiedUser.posts.push(input.posts);
    modifiedUser.updatedAt = new Date();
    const mutatedArr = this.inMemoryUsers.filter((u) => u !== modifiedUser);
    Logger.info(mutatedArr);
    Logger.info(modifiedUser);
    mutatedArr.push(modifiedUser);
    Logger.info(mutatedArr);
    this.inMemoryUsers = mutatedArr;
    return modifiedUser;
  }
}
