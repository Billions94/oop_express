import { Space } from '../entity/space';
import { DeleteResult, Repository } from 'typeorm';
import { DB } from '../../db/dbConnect';
import { Service } from 'typedi';
import { User } from '../../user/entity/user';

@Service()
export class SpaceRepository extends Repository<Space> {
  constructor() {
    super(Space, DB.myDataSource.createEntityManager());
  }

  async findById(id: number): Promise<Space> {
    return (await this.findOne({ where: { id: id } })) as Space;
  }

  async isExists(id: number): Promise<boolean> {
    const space = await this.findOne({ where: { id: id } });
    return !!space;
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return this.delete({ id });
  }

  async findAndIncludeUserRelation(): Promise<Space[]> {
    return this.createQueryBuilder('space')
      .leftJoinAndSelect('space.users', 'users')
      .getMany();
  }

  async customUpdateBuilder(
    space: Space,
    update: any,
    user: User
  ): Promise<void> {
    space.name = update.name;
    if (update.isActive) space.isActive = update.isActive;
    user.spaces = [...user.spaces, space];
    await this.save(space);
  }
  async deleteByManyToManyRelations(
    id: number,
    user: User
  ): Promise<void> {
    user.spaces = user.spaces.filter((space) => space.id !== id);
    await this.manager.softRemove(Space, { id: id });
  }
}
