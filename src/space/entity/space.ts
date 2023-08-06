import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entity/user';
import { Message } from '../../message/entity/message';

@Entity({ name: 'space' })
export class Space {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { name: 'name', nullable: false })
  name: string;
  @ManyToMany(() => User, (user) => user.spaces, { eager: true })
  members: User[];
  @OneToMany(() => Message, (message) => message.space, { eager: true })
  @JoinColumn({ name: 'spaces_id' })
  messages: Message[];
  @Column('boolean', { name: 'is_active' })
  isActive: boolean;
  @Column('timestamptz', { name: 'created_at', nullable: false })
  createdAt: Date;
  @Column('timestamptz', { name: 'updated_at', nullable: true })
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;

  @BeforeInsert()
  updateCreateAt() {
    this.createdAt = new Date();
  }

  @BeforeUpdate()
  updateUpdateAt() {
    this.updatedAt = new Date();
  }
}
