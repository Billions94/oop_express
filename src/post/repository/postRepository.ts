import { Repository } from 'typeorm';
import { Post } from '../entity/post';
import { DB } from '../../db/dbConnect';
import { Service } from 'typedi';

@Service()
export class PostRepository extends Repository<Post> {
  constructor() {
    super(Post, DB.myDataSource.createEntityManager());
  }

  async findById(id: number): Promise<Post | null> {
    return this.findOne({ where: { id: id } });
  }
}
