import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from '../../post/entity/post';

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
  @Column('varchar', { name: 'password', length: 500, nullable: false })
  password: string;
  @Column('varchar', { name: 'refresh_token', length: 500, nullable: true })
  private refreshToken: string | null;
  @Column('timestamptz', { name: 'created_at', nullable: false })
  createdAt: Date;
  @Column('timestamp', { name: 'updated_at', nullable: true })
  updatedAt: Date;

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

  getJSONObject(): Object {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      email: this.email,
      posts: this.posts ?? [],
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  getRefreshToken(): string {
    return <string>this.refreshToken;
  }

  setRefreshToken(value: string | null): void {
    this.refreshToken = value;
  }
}
