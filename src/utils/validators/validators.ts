import { UserInput } from '../../user/interfaces/userInput';

export class Validator {
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

  public static isExistsByEmail(existingEmail: string, newEmail: string): void {
    if (existingEmail === newEmail)
      throw new Error('Email already exists');
  }
}