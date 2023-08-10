import { DB } from '../../db/dbConnect';
import { User } from '../entity/user';
import { Repository } from 'typeorm';
import { Service } from 'typedi';

@Service()
export class UserRepository extends Repository<User> {
  constructor() {
    super(User, DB.dataSource.createEntityManager());
  }

  async isExistByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email: email } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email: email } });
  }

  async findById(id: number): Promise<User> {
    return (await this.findOne({ where: { id: id } })) as User;
  }

  async findByDeletedAt(deletedAt: Date): Promise<User | null> {
    return await this.findOne({ where: { deletedAt: deletedAt } });
  }

  async deleteById(id: number): Promise<void> {
    await this.delete({ id });
  }

  async isExists(id: number): Promise<boolean> {
    return !!(await this.findOne({ where: { id: id } }));
  }
}
