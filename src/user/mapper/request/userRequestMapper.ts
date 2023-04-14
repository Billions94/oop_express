import bcryptService from 'bcrypt';
import { UserInput } from '../../interfaces/userInput';
import { User } from '../../entity/user';
import * as process from 'process';
import dotenv from 'dotenv';
dotenv.config()

export async function userRequestMapper(userInput: UserInput): Promise<User> {
  const user: User = new User();
  user.name = userInput.name;
  user.email = userInput.email;
  user.age = userInput.age;
  user.password = await bcryptService.hash(
    userInput.password,
    parseInt(<string>process.env.SALT_FACTOR)
  )

  return user;
}