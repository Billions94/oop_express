import {
  BeforeInsert,
  BeforeUpdate,
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
  @ManyToOne(() => User, (user) => user.posts, {
    eager: true,
    onDelete: 'CASCADE',
  })
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

  @BeforeInsert()
  updateCreatedAt() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateUpdatedAt() {
    this.updatedAt = new Date();
  }
}
