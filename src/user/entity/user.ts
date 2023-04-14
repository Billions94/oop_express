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
import { Space } from '../../spaces/entity/space';
import bcryptService from 'bcrypt';

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
  @OneToMany(() => Post, (post) => post.user, { eager: true })
  @JoinColumn({ name: 'user_id' })
  posts: Post[];
  @ManyToMany(() => Space, (space) => space.users, {
    eager: true,
    cascade: ['remove'],
  })
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

  constructor();
  constructor(name: string);
  constructor(name: string, age: number);
  constructor(name: string, age: number, email: string);
  constructor(name?: string, age?: number, email?: string, password?: string);
  constructor(name?: string, age?: number, email?: string, password?: string) {
    this.name = <string>name;
    this.age = <number>age;
    this.email = <string>email;
    this.password = <string>password;
  }

  @BeforeInsert()
  updateCreatedAt() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateUpdatedAt() {
    this.updatedAt = new Date();
  }
}
