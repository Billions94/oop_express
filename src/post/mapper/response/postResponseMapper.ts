import { Post } from '../../entity/post';
import { userResponseMapper } from '../../../user/mapper/response/userResponseMapper';

export function postResponseMapper(post: Post): Post {
  return <Post>{
    id: post.id,
    user: userResponseMapper(post.user),
    content: post.content,
    media: post.media,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}