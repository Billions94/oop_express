import { Space } from '../../space/entity/space';
import { Message } from '../../message/entity/message';

export interface UserDto {
  id: number;
  name: string;
  age: number;
  email: string;
  bio: string;
  spaces: Space[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
