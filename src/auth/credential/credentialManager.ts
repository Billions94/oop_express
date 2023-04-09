import { UserRepository } from '../../user/repository/userRepository';
import bcrypt from 'bcrypt';

export class CredentialManager {
  private static userRepository: UserRepository = new UserRepository();
  private static bcryptService = bcrypt;

  static async verifyCredentials(email: string, password: string) {
    const user = await CredentialManager
      .userRepository
      .findByEmail(email);

    if (user) {
      const isMatch = await CredentialManager
        .bcryptService
        .compare(password, user.password);
      if (isMatch) {
        return user;
      } else {
        return null;
      }
    }
  }
}
