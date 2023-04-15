import { SpaceRepository } from '../repository/spaceRepository';
import { Space } from '../entity/space';
import { Service } from 'typedi';
import { CreateSpaceResponse } from '../interfaces/createSpaceResponse';
import { UserRepository } from '../../user/repository/userRepository';
import { SpaceInput } from '../interfaces/spaceInput';
import { SpaceResponse } from '../interfaces/spaceResponse';
import { Validator } from '../../utils/validators/validators';
import { DeleteSpaceResponse } from '../interfaces/deleteSpaceResponse';
import { User } from '../../user/entity/user';
import { removeUserSensitiveInfo } from '../mapper/response/removeUserSensitiveInfo';
import { spaceRequestMapper } from '../mapper/request/spaceRequestMapper';
import Logger from '../../utils/log/Logger';
import { Inject } from 'typescript-ioc';

@Service()
export class SpaceService {
  constructor(
    @Inject private readonly spaceRepository: SpaceRepository,
    @Inject private readonly userRepository: UserRepository
  ) {}

  async createSpace(
    user: User,
    input: SpaceInput
  ): Promise<Partial<CreateSpaceResponse>> {
    try {
      if (!this.spaceRepository)
        return { message: 'Space repository not found' };

      Validator.validateSpaceInput(input);
      const space = spaceRequestMapper(input, user);
      await this.spaceRepository.save(space);

      user.spaces = [...user.spaces, space];
      await this.userRepository.save(user);
      return {
        statusCode: 201,
        message: 'Space created successfully',
        data: { id: space.id },
      };
    } catch (e) {
      Logger.info(e)
      return {
        statusCode: e.statusCode,
        message: e.message,
        data: { id: null },
      };
    }
  }

  async getSpaces(): Promise<Space[]> {
    try {
      if (!this.spaceRepository) return [];

      const spaces = await this.spaceRepository.findAndIncludeUserRelation();
      spaces.map(removeUserSensitiveInfo);
      return spaces;
    } catch (e) {
      Logger.info(e.message)
      return []
    }
  }

  async getSpaceById(id: number): Promise<Partial<SpaceResponse>> {
    try {
      if (!this.spaceRepository)
        return { message: 'Space repository not found' };

      await Validator.throwErrorIfNotExist(id, 'space');
      const space = await this.spaceRepository.findById(id);
      return {
        statusCode: 200,
        message: 'Space retrieved successfully',
        data: { space },
      };
    } catch (e) {
      Logger.info(e)
      return {
        statusCode: e.statusCode,
        message: e.message,
        data: { space: null },
      };
    }
  }

  async updateSpace(
    id: number,
    update: SpaceInput,
    userId?: number
  ): Promise<Partial<SpaceResponse>> {
    try {
      if (!this.spaceRepository)
        return { message: 'Space repository not found' };

      await Validator.throwErrorIfNotExist(id, 'space');
      const space = await this.spaceRepository.findById(id);
      space.name = update.name;
      if (!update.isActive) {
        space.isActive = update.isActive;
      } else {
        space.isActive = true;
      }
      await this.spaceRepository.save(space);

      if (userId) {
        const user = await this.userRepository.findById(<number>userId);
        await this.spaceRepository.customUpdateBuilder(space, update, user);
        await this.userRepository.save(user);
      }
      return {
        statusCode: 203,
        message: 'Space updated successfully',
        data: { space },
      };
    } catch (e) {
      return {
        statusCode: e.statusCode,
        message: e.message,
        data: { space: null },
      };
    }
  }

  async deleteSpace(
    id: number,
    user: User
  ): Promise<Partial<DeleteSpaceResponse>> {
    try {
      if (!this.spaceRepository)
        return { message: 'Space repository not found' };

      await Validator.throwErrorIfNotExist(id, 'space');
      await this.spaceRepository.deleteByManyToManyRelations(id, user);
      return {
        statusCode: 200,
        message: 'Space successfully deleted',
      };
    } catch (e) {
      return {
        statusCode: e.statusCode,
        message: e.message,
      };
    }
  }
}
