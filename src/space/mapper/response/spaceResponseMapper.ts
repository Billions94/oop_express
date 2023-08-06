import { Space } from '../../entity/space';
import { userResponseMapper } from '../../../user/mapper/response/userResponseMapper';
import { messageResponseMapper } from '../../../message/mapper/response/messageResponseMapper';

export function spaceResponseMapper(space: Space): Space {
  return <Space>{
    id: space.id,
    name: space.name,
    members: space.members.map(userResponseMapper),
    messages: space.messages.map(messageResponseMapper),
    isActive: space.isActive,
    createdAt: space.createdAt,
    updatedAt: space.updatedAt,
  };
}
