import { UserInput } from '../../user/interfaces/userInput';
import { UserRepository } from '../../user/repository/userRepository';
import { Container } from 'typedi';
import { CustomError } from '../../error/customError';

export class Validator {
  private static readonly userRepository: UserRepository =
    Container.get(UserRepository);

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

  public static async throwErrorIfNotExist(id: number): Promise<void> {
    const exist = await this.userRepository.isExists(id);
    if (!exist) {
      throw new CustomError('doesNotExistError', 400, 'user does not exist');
    }
  }
}
