import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entity/user';

@Entity({ name: 'spaces' })
export class Space {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { name: 'name', nullable: false })
  name: string;
  @ManyToMany(() => User, (user) => user.spaces)
  users: User[];
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
