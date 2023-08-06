import { MessageInput } from '../../interfaces/messageInput';
import { Message } from '../../entity/message';
import { User } from '../../../user/entity/user';

export function messageRequestMapper(input: MessageInput, user: User): Message {
  const message = new Message();
  message.user = user;
  message.content = input.content;
  message.media = input.media ? input.media : '';

  return message;
}