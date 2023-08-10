import { RegisterUserInput } from '../../user/interfaces/registerUserInput';
import { UserRepository } from '../../user/repository/userRepository';
import { CustomError } from '../../error/customError';
import { SpaceRepository } from '../../space/repository/spaceRepository';
import { PostRepository } from '../../post/repository/postRepository';
import { PostInput } from '../../post/interfaces/postInput';
import { SpaceInput } from '../../space/interfaces/spaceInput';
import { Inject } from 'typescript-ioc';

export class Validator {
  @Inject
  private static readonly userRepository: UserRepository;
  @Inject
  private static readonly postRepository: PostRepository;
  @Inject
  private static readonly spaceRepository: SpaceRepository;

  /**
   * @remarks This is a custom method.
   * Throws specific input field errors if the field is empty or
   * if the field does not meet the required validation criteria.
   * @param input - A set of input fields to be validated.
   * @returns A promise of type void.
   */
  public static validateRegisterInput(input: RegisterUserInput) {
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

  /**
   * @remarks This is a custom method.
   * Throws specific input field errors if the field is empty or
   * if the field does not meet the required validation criteria.
   * @param input - A set of input fields to be validated.
   * @returns A promise of type void.
   */
  public static validatePostInput(input: PostInput) {
    if (input.content.trim().length <= 0)
      throw new Error('Content field cannot be empty');
  }

  /**
   * @remarks This is a custom method.
   * Throws specific input field errors if the field is empty or
   * if the field does not meet the required validation criteria.
   * @param input - A set of input fields to be validated.
   * @returns A promise of type void.
   */
  public static validateSpaceInput(input: SpaceInput) {
    if (input.name.trim().length <= 0)
      throw new Error('Name field cannot be empty');
  }

  /**
   * @remarks This is a custom method.
   * Throws an error if an email already exists in a connected
   * database or datasource
   * @param email - An email to compare with an existing email in
   * a connected database or datasource
   * @returns A promise of type void.
   */
  public static async isExistsByEmail(email: string): Promise<void> {
    if ((await this.userRepository.isExistByEmail(email))?.email === email)
      throw new Error('Email already exists');
  }

  /**
   * @remarks This is a custom method.
   * Throws an error for an entity passed as param, if they do not exist.
   * The id has to be from the entity passed as matcher.
   * @param id - Identifier for the entity e.g. x.id, with x being the entity.
   * @param matcher - Matcher or alias for the entity in lowercase
   * e.g. 'user' or 'post' or 'space'
   * @returns A promise of type void.
   * @beta
   */
  public static async throwErrorIfNotExist(
    id: number,
    matcher?: string
  ): Promise<void> {
    switch (matcher) {
      case 'user':
        const user = await this.userRepository.isExists(id);
        if (!user) {
          throw new CustomError(
            'userDoesNotExistError',
            404,
            'user does not exist'
          );
        }
        break;

      case 'space':
        const space = await this.spaceRepository.isExists(id);
        if (!space) {
          throw new CustomError(
            'spaceDoesNotExistError',
            404,
            'space does not exist'
          );
        }
        break;

      case 'post':
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
          'generic error',
          500,
          'could not determine error Object'
        );
    }
  }
}
