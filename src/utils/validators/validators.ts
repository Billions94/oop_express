import { UserInput } from '../../user/interfaces/userInput';
import { UserRepository } from '../../user/repository/userRepository';
import { Container } from 'typedi';
import { CustomError } from '../../error/customError';
import { SpaceRepository } from '../../spaces/repository/spaceRepository';
import { Post } from '../../post/entity/post';
import { PostRepository } from '../../post/repository/postRepository';

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

    if (input.age <= 0)
      throw new Error('Age field cannot be zero or negative');

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

    if (existingEmail === newEmail)
      throw new Error('Email already exists');
  }

  /**
   * @remarks
   * This is a custom method.
   *
   * Returns an error for an entity passed as param, if they do not exist.
   * The id has to be from the entity passed as matcher.
   *
   * @param id - Identifier for the entity eg. x.id, with x being the entity.
   * @param matcher - Matcher or alias for the entity eg. 'User | user' or 'Post | post'
   * or 'Space | space'
   * @returns A promise of type void.
   *
   * @beta
   */
  public static async throwErrorIfNotExist(
    id: number,
    matcher?: string
  ): Promise<void> {
    switch (matcher) {
      case 'user' || 'User':
        const user = await this.userRepository.isExists(id);
        if (!user) {
          throw new CustomError(
            'userDoesNotExistError',
            400,
            'user does not exist'
          );
        }
        break;

      case 'space' || 'Space':
        const space = await this.spaceRepository.isExists(id);
        if (!space) {
          throw new CustomError(
            'spaceDoesNotExistError',
            404,
            'space does not exist'
          );
        }
        break;

      case 'post' || 'Post':
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
