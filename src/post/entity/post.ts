import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entity/user';

@Entity({ name: 'post' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'user_id' })
  user: User;
  @Column('text', { name: 'content', nullable: false })
  content: string;
  @Column('text', { name: 'media', nullable: true })
  media: string;
  @Column('timestamptz', { name: 'created_at', nullable: false })
  createdAt: Date;
  @Column('timestamptz', { name: 'updated_at', nullable: true })
  updatedAt: Date;

  constructor();
  constructor(content: string);
  constructor(content: string, media: string);
  constructor(content?: string, media?: string) {
    this.content = <string>content;
    this.media = <string>media;
  }

  toJSONObject(): Object {
    return {
      id: this.id,
      user: this.user,
      content: this.content,
      media: this.media,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
