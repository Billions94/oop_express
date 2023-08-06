import { Service } from 'typedi';
import { MessageServiceInterface } from '../interfaces/messageServiceInterface';
import { CreateMessageResponse } from '../interfaces/createMessageResponse';
import { DeleteMessageResponse } from '../interfaces/deleteMessageResponse';
import { MessageResponse } from '../interfaces/messageResponse';
import { Message } from '../entity/message';
import { Inject } from 'typescript-ioc';
import { MessageRepository } from '../repository/messageRepository';
import { MessageInput } from '../interfaces/messageInput';
import { messageRequestMapper } from '../mapper/request/messageRequestMapper';
import Logger from '../../utils/log/Logger';
import { messageResponseMapper } from '../mapper/response/messageResponseMapper';
import { User } from '../../user/entity/user';

@Service()
export class MessageService implements MessageServiceInterface {
  @Inject
  private readonly messageRepository: MessageRepository;

  async createMessage(
    messageInput: MessageInput,
    user: User
  ): Promise<Partial<CreateMessageResponse>> {
    try {
      const message = messageRequestMapper(messageInput, user);
      await this.messageRepository.save(message);

      return { statusCode: 201, data: { id: message.id } };
    } catch (e) {
      Logger.info(e, 'Error creating message');
      return {
        statusCode: 500,
        errorMessage: e.message,
        data: null,
      };
    }
  }

  async messages(): Promise<Message[]> {
    return this.messageRepository
      .find()
      .then((users) => users.map(messageResponseMapper));
  }

  async getMessage(id: number): Promise<Partial<MessageResponse>> {
    try {
      const message = await this.messageRepository
        .findById(id)
        .then(messageResponseMapper);

      return { statusCode: 200, data: { message } };
    } catch (e) {
      Logger.info(e, 'Message not found');
      return {
        statusCode: 404,
        errorMessage: e.message,
        data: null,
      };
    }
  }

  async updateMessage(
    id: number,
    update: MessageInput
  ): Promise<Partial<MessageResponse>> {
    try {
      const message = (await this.messageRepository.findByIdAndUpdate(
        id,
        update
      )) as Message;

      return { statusCode: 203, data: { message } };
    } catch (e) {
      Logger.info(e, 'Message not found');
      return {
        statusCode: 404,
        errorMessage: e.message,
        data: null,
      };
    }
  }

  async deleteMessage(id: number): Promise<DeleteMessageResponse> {
    try {
      if (!(await this.messageRepository.isExists(id))) {
        throw new Error(`Message ${id} not found`);
      }
      return { statusCode: 200, success: true };
    } catch (e) {
      return { statusCode: 404, success: false };
    }
  }
}
