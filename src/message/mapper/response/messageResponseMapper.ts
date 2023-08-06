import { Message } from '../../entity/message';
import { userResponseMapper } from '../../../user/mapper/response/userResponseMapper';

export function messageResponseMapper(message: Message): Message {
  return <Message>{
    id: message.id,
    user: userResponseMapper(message.user),
    content: message.content,
    media: message.media,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt
  }
}