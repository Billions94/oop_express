import { UserRepository } from '../../user/repository/userRepository';
import bcryptService from 'bcrypt';
import { Container } from 'typedi';

/**
 * Credential manager for verifying User entities credentials
 */
export class CredentialManager {
  private static readonly userRepository: UserRepository =
    Container.get(UserRepository);

  /**
   * @remarks This is a custom method.
   * Returns a user if it exists in the database or datasource provided
   * the credentials verification criteria is met.
   * @param email - Email for user entity saved in the database or datasource.
   * @param password - Password for user entity saved in the database or datasource.
   * @returns A promise of type <User | null | undefined>.
   * @beta
   */
  public static async verifyCredentials(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (user) {
      if (await bcryptService.compare(password, user.password)) return user;
      else return null;
    }
  }
}
