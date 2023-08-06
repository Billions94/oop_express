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
import { spaceResponseMapper } from '../mapper/response/spaceResponseMapper';

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

      space.members = [...space.members, user];
      await this.userRepository.save(user);
      return {
        statusCode: 201,
        message: 'Space created successfully',
        data: { id: space.id },
      };
    } catch (e) {
      Logger.info(e);
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

      const spaces = await this.spaceRepository.find();
      spaces.map(removeUserSensitiveInfo);
      return spaces.map(spaceResponseMapper);
    } catch (e) {
      Logger.info(e.message);
      return [];
    }
  }

  async getSpaceById(id: number): Promise<Partial<SpaceResponse>> {
    try {
      if (!this.spaceRepository)
        return { message: 'Space repository not found' };

      await Validator.throwErrorIfNotExist(id, 'space');
      const space = await this.spaceRepository
        .findById(id)
        .then(spaceResponseMapper);
      return {
        statusCode: 200,
        message: 'Space retrieved successfully',
        data: { space },
      };
    } catch (e) {
      Logger.info(e);
      return {
        statusCode: e.statusCode,
        message: e.message,
        data: { space: null },
      };
    }
  }

  async updateSpace(
    id: number,
    update: SpaceInput
  ): Promise<Partial<SpaceResponse>> {
    try {
      if (!this.spaceRepository)
        return { message: 'Space repository not found' };

      await Validator.throwErrorIfNotExist(id, 'space');
      await this.spaceRepository.updateSpace(id, update);
      const space = await this.spaceRepository
        .findById(id)
        .then(spaceResponseMapper);

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

  async addMembersToSpace(
    spaceId: number,
    userId: number,
    update: SpaceInput
  ): Promise<Partial<SpaceResponse>> {
    try {
      const user = await this.userRepository.findById(userId);
      await this.spaceRepository.customUpdateBuilder(spaceId, user, update);
      const space = await this.spaceRepository
        .findById(spaceId)
        .then(spaceResponseMapper);

      return { statusCode: 203, data: { space } };
    } catch (e) {
      return {
        statusCode: 404,
        message: e.message,
        data: { space: null },
      };
    }
  }

  async deleteSpace(id: number): Promise<Partial<DeleteSpaceResponse>> {
    try {
      if (!this.spaceRepository)
        return { message: 'Space repository not found' };

      await Validator.throwErrorIfNotExist(id, 'space');
      await this.spaceRepository.deleteByManyToManyRelations(id);
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
