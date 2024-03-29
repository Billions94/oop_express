import { Repository } from 'typeorm';
import { Post } from '../entity/post';
import { DB } from '../../db/dbConnect';
import { Service } from 'typedi';

@Service()
export class PostRepository extends Repository<Post> {
  constructor() {
    super(Post, DB.dataSource.createEntityManager());
  }

  async findById(id: number): Promise<Post | null> {
    return this.findOne({ where: { id: id } });
  }

  async isExists(id: number): Promise<boolean> {
    const post = await this.findOne({ where: { id: id } });
    return !!post;
  }

  async deleteById(id: number): Promise<void> {
    await this.delete({ id: id });
  }
}
