import { SpaceService } from '../service/spaceService';
import { User } from '../../user/entity/user';
import { Inject } from 'typescript-ioc';
import {
  ContextRequest,
  DELETE,
  GET,
  PATCH,
  Path,
  PathParam,
  POST,
} from 'typescript-rest';
import { Request } from 'express';
import { SpaceInput } from '../interfaces/spaceInput';
import { Space } from '../entity/space';
import { SpaceResponse } from '../interfaces/spaceResponse';
import { CreateSpaceResponse } from '../interfaces/createSpaceResponse';
import { DeleteSpaceResponse } from '../interfaces/deleteSpaceResponse';

@Path('api/spaces')
export class SpaceController {
  @Inject
  private readonly spaceService: SpaceService;

  @GET
  async getSpaces(): Promise<Space[]> {
    return this.spaceService.getSpaces();
  }

  @GET
  @Path(':id')
  async getSpaceById(
    @PathParam('id') id: number
  ): Promise<Partial<SpaceResponse>> {
    return this.spaceService.getSpaceById(id);
  }

  @POST
  async createSpace(
    @ContextRequest { user }: Request,
    input: SpaceInput
  ): Promise<Partial<CreateSpaceResponse>> {
    return this.spaceService.createSpace(<User>user, input);
  }

  @PATCH
  @Path(':id')
  async updateSpace(
    @PathParam('id') id: number,
    update: SpaceInput
  ): Promise<Partial<SpaceResponse>> {
    return this.spaceService.updateSpace(id, update);
  }

  @PATCH
  @Path(':id/:userId')
  async addMembersToSpace(
    @PathParam('id') id: number,
    @PathParam('userId') userId: number,
    update: SpaceInput
  ): Promise<Partial<SpaceResponse>> {
    return this.spaceService.addMembersToSpace(id, userId, update);
  }

  @DELETE
  @Path(':id')
  async deleteSpace(
    @PathParam('id') id: number,
    @ContextRequest { user }: Request
  ): Promise<Partial<DeleteSpaceResponse>> {
    return this.spaceService.deleteSpace(id);
  }
}
