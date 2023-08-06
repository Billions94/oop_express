import {
  ContextRequest,
  DELETE,
  GET,
  PATCH,
  Path,
  PathParam,
  POST,
} from 'typescript-rest';
import { Inject } from 'typescript-ioc';
import { MessageService } from '../service/messageService';
import { Message } from '../entity/message';
import { MessageResponse } from '../interfaces/messageResponse';
import { CreateMessageResponse } from '../interfaces/createMessageResponse';
import { DeleteMessageResponse } from '../interfaces/deleteMessageResponse';
import { MessageInput } from '../interfaces/messageInput';
import { Request } from 'express';
import { User } from '../../user/entity/user';

@Path('api/messages')
export class MessageController {
  @Inject
  private readonly messageService: MessageService;

  @POST
  addMessage(
    @ContextRequest { user }: Request,
    messageInput: MessageInput
  ): Promise<Partial<CreateMessageResponse>> {
    return this.messageService.createMessage(messageInput, <User>user);
  }

  @GET
  getMessages(): Promise<Message[]> {
    return this.messageService.messages();
  }

  @GET
  @Path(':id')
  getMessageById(
    @PathParam('id') id: number
  ): Promise<Partial<MessageResponse>> {
    return this.messageService.getMessage(id);
  }

  @PATCH
  updateMessage(
    @PathParam('id') id: number,
    update: MessageInput
  ): Promise<Partial<MessageResponse>> {
    return this.messageService.updateMessage(id, update);
  }

  @DELETE
  deleteMessage(@PathParam('id') id: number): Promise<DeleteMessageResponse> {
    return this.messageService.deleteMessage(id);
  }
}
