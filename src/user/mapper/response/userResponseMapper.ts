import { User } from '../../entity/user';
import { UserDto } from '../../interfaces/userDto';

export function userResponseMapper(user: User): UserDto {
  return {
    id: user.id,
    name: user.name,
    age: user.age,
    email: user.email,
    bio: user.bio,
    spaces: user.spaces,
    messages: user.messages,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
