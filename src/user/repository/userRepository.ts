import { DB } from '../../db/dbConnect';
import { User } from '../entity/user';
import { DeleteResult, Repository } from 'typeorm';
import { Service } from 'typedi';

@Service()
export class UserRepository extends Repository<User> {
  constructor() {
    super(User, DB.myDataSource.createEntityManager());
  }

  async isExistByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email: email } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ where: { email: email } });
  }

  async findById(id: number): Promise<User> {
    return await this.findOne({ where: { id: id } }) as User;
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return this.delete({ id: id });
  }

  async isExists(id: number): Promise<boolean> {
    const existing = await this.findOne({ where: { id: id } });
    return !!existing;
  }
}