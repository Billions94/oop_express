import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../post/entity/post';
import { Space } from '../../space/entity/space';
import { Message } from '../../message/entity/message';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number = 0;
  @Column('varchar', { name: 'name', length: 500, nullable: false })
  name: string;
  @Column({ type: 'int', name: 'age', nullable: false })
  age: number;
  @Index({ unique: true })
  @Column('varchar', { name: 'email', length: 500, nullable: false })
  email: string;
  @OneToMany(() => Post, (post) => post.user)
  @JoinColumn({ name: 'user_id' })
  posts: Post[];
  @OneToMany(() => Message, (message) => message.user)
  @JoinColumn({ name: 'user_id' })
  messages: Message[];
  @ManyToMany(() => Space, (space) => space.members)
  @JoinTable({ name: 'user_space' })
  spaces: Space[];
  @Column('varchar', { name: 'password', length: 500, nullable: false })
  password: string;
  @Column('varchar', { name: 'refresh_token', length: 500, nullable: true })
  refreshToken: string | null;
  @Column('timestamptz', { name: 'created_at', nullable: false })
  createdAt: Date;
  @Column('timestamptz', { name: 'updated_at', nullable: true })
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  updateCreatedAt() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateUpdatedAt() {
    this.updatedAt = new Date();
  }
}
