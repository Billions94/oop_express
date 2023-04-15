import { Post } from '../../entity/post';

export function postResponseMapper(post: Post): Post {
  return <Post>{
    id: post.id,
    user: post.user,
    content: post.content,
    media: post.media,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}