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

@Path('api/spaces')
export class SpaceController {
  @Inject private readonly spaceService: SpaceService;

  @GET
  async getSpaces() {
    return this.spaceService.getSpaces();
  }

  @GET
  @Path(':id')
  async getSpaceById(@PathParam('id') id: number) {
    return this.spaceService.getSpaceById(id);
  }

  @POST
  async createSpace(@ContextRequest { user }: Request, input: SpaceInput) {
    return this.spaceService.createSpace(<User>user, input);
  }

  @PATCH
  @Path(':id')
  async updateSpace(@PathParam('id') id: number, update: SpaceInput) {
    return this.spaceService.updateSpace(id, update);
  }

  @PATCH
  @Path(':id/:userId')
  async addUserToExistingSpace(
    @PathParam('id') id: number,
    @PathParam('userId') userId: number,
    update: SpaceInput
  ) {
    return this.spaceService.updateSpace(id, update, userId);
  }

  @DELETE
  @Path(':id')
  async deleteSpace(
    @PathParam('id') id: number,
    @ContextRequest { user }: Request
  ) {
    return this.spaceService.deleteSpace(id, <User>user);
  }
}
