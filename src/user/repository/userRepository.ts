import { DB } from '../../db/dbConnect';
import { User } from '../entity/user';
import { Repository } from 'typeorm';

export class UserRepository extends Repository<User> {
  constructor() {
    super(User, DB.myDataSource.createEntityManager());
  }

  async isExistByEmail(email: string) {
    return this.findOne({ where: { email: email } });
  }

  async findByEmail(email: string) {
    return this.findOne({ where: { email: email } });
  }

  async findById(id: number) {
    return this.findOne({ where: { id: id } });
  }

  async deleteById(id: number) {
    return this.delete({ id: id });
  }
}