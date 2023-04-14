import { Post } from '../../entity/post';
import { PostInput } from '../../interfaces/postInput';
import { User } from '../../../user/entity/user';

export function postRequestMapper(input: PostInput, user: User): Post {
  const post = new Post();
  post.user = user;
  post.content = input.content;
  post.media = input.media ?? '';
  return post;
}
