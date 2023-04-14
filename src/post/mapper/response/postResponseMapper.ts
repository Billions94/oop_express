import { Post } from '../../entity/post';

export function postResponseMapper(post: Post): Post {
  return <Post>{
    id: this.id,
    user: this.user,
    content: this.content,
    media: this.media,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
}