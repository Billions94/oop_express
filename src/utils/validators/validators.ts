import { UserInput } from '../../user/interfaces/userInput';
import { UserRepository } from '../../user/repository/userRepository';
import { Container } from 'typedi';
import { CustomError } from '../../error/customError';
import { SpaceRepository } from '../../spaces/repository/spaceRepository';
import { Post } from '../../post/entity/post';
import { PostRepository } from '../../post/repository/postRepository';
import Logger from '../log/Logger';

export class Validator {
  private static readonly userRepository: UserRepository =
    Container.get(UserRepository);
  private static readonly postRepository: PostRepository =
    Container.get(PostRepository);
  private static readonly spaceRepository: SpaceRepository =
    Container.get(SpaceRepository);

  public static validateInput(input: UserInput) {
    if (input.name.trim().length <= 0)
      throw new Error('Name field cannot be empty');

    if (input.age <= 0) throw new Error('Age field cannot be zero or negative');

    if (input.email.trim().length <= 0)
      throw new Error('Email field cannot be empty');

    if (input.password.trim().length <= 0)
      throw new Error('Password field cannot be empty');

    if (input.confirmPassword.trim().length <= 0)
      throw new Error('Confirm Password field cannot be empty');

    if (input.confirmPassword !== input.password)
      throw new Error('Passwords do not match');
  }

  public static async isExistsByEmail(newEmail: string): Promise<void> {
    const existingEmail = (
      await Validator.userRepository.isExistByEmail(newEmail)
    )?.email;

    if (existingEmail === newEmail) throw new Error('Email already exists');
  }

  public static async throwErrorIfNotExist(
    id: number,
    matcher?: string
  ): Promise<void> {
    switch (matcher) {
      case 'users':
        const user = await this.userRepository.isExists(id);
        if (!user) {
          throw new CustomError(
            'userDoesNotExistError',
            400,
            'user does not exist'
          );
        }
        break;

      case 'spaces':
        const space = await this.spaceRepository.isExists(id);
        Logger.info(space)
        if (!space) {
          throw new CustomError(
            'spaceDoesNotExistError',
            404,
            'space does not exist'
          );
        }
        break;

      case 'posts':
        const post = await this.postRepository.isExists(id);
        if (!post) {
          throw new CustomError(
            'postDoesNotExistError',
            404,
            'post does not exist'
          );
        }
        break;

      default:
        throw new CustomError(
          'couldNotDetermineSpace',
          500,
          'could not determine error Object'
        );
    }
  }
}
