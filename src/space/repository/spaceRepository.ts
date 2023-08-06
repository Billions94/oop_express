import { Space } from '../entity/space';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { DB } from '../../db/dbConnect';
import { Service } from 'typedi';
import { User } from '../../user/entity/user';
import Logger from '../../utils/log/Logger';
import { SpaceInput } from '../interfaces/spaceInput';

@Service()
export class SpaceRepository extends Repository<Space> {
  constructor() {
    super(Space, DB.dataSource.createEntityManager());
  }

  async findById(id: number): Promise<Space> {
    return (await this.findOne({ where: { id: id } })) as Space;
  }

  async isExists(id: number): Promise<boolean> {
    const space = await this.findOne({ where: { id: id } });
    return !!space;
  }

  async updateSpace(id: number, update: any) {
    const spaceToUpdate = await this.findById(id);

    return await this.createQueryBuilder()
      .relation(Space, 'members')
      .of(spaceToUpdate)
      .update({
        name: update.name,
        isActive: update.isActive,
      })
      .execute();
  }

  async customUpdateBuilder(
    id: number,
    user: User,
    update: SpaceInput
  ): Promise<void> {
    if (!user) {
      Logger.info(`User not found`);
      throw new Error(`User not found`);
    }

    const spaceToUpdate = await this.findById(id);
    spaceToUpdate.name = update.name;
    spaceToUpdate.isActive = update.isActive;

    const existingMembers = await this.createQueryBuilder('space')
      .leftJoinAndSelect('space.members', 'users')
      .getExists();

    if (existingMembers) {
      Logger.info(`${user.name} is already in this space`);
      throw new Error(`${user.name} is already in this space`);
    }

    return await this.createQueryBuilder()
      .relation(Space, 'members')
      .of(spaceToUpdate)
      .add(user);
  }
  async deleteByManyToManyRelations(id: number): Promise<void> {
    const space = await this.findById(id);
    space.members.filter((user) => user.id !== id);
    await this.manager.softRemove(Space, { id: id });
  }
}
