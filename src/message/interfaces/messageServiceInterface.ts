import { Message } from '../entity/message';
import { CreateMessageResponse } from './createMessageResponse';
import { MessageResponse } from './messageResponse';
import { DeleteMessageResponse } from './deleteMessageResponse';
import { MessageInput } from './messageInput';
import { User } from '../../user/entity/user';

export interface MessageServiceInterface {
  createMessage(message: MessageInput, user: User): Promise<Partial<CreateMessageResponse>>
  messages(): Promise<Message[]>
  getMessage(id: number): Promise<Partial<MessageResponse>>
  updateMessage(id: number, update: MessageInput): Promise<Partial<MessageResponse>>
  deleteMessage(id: number): Promise<DeleteMessageResponse>
}