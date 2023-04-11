import { UserRepository } from '../../user/repository/userRepository';
import bcryptService from 'bcrypt';
import { Container } from 'typedi';

export class CredentialManager {
  private static userRepository: UserRepository = Container.get(UserRepository);

  static async verifyCredentials(email: string, password: string) {
    const user = await CredentialManager.userRepository.findByEmail(email);

    if (user) {
      if (await bcryptService.compare(password, user.password)) {
        return user;
      } else {
        return null;
      }
    }
  }
}
