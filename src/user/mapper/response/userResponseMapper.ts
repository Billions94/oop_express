import { User } from '../../entity/user';

export function userResponseMapper(user: User): User {
  return <User>{
    id: user.id,
    name: user.name,
    age: user.age,
    email: user.email,
    posts: user.posts ?? [],
    spaces: user.spaces,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}