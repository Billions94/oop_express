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
import { Space } from '../../space/entity/space';

@Entity({ name: 'message' })
export class Message {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => User, (user) => user.messages, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @ManyToOne(() => Space, (space) => space.messages)
  @JoinColumn({ name: 'spaces_id ' })
  space: Space;
  @Column('text', { name: 'message', nullable: false })
  content: string;
  @Column('text', { name: 'media' })
  media: string;
  @Column('timestamptz', { name: 'created_at', nullable: false })
  createdAt: Date;
  @Column('timestamptz', { name: 'updated_at', nullable: true })
  updatedAt: Date;

  @BeforeInsert()
  updateCreatedAt(): void {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateUpdatedAt(): void {
    this.updatedAt = new Date();
  }
}
