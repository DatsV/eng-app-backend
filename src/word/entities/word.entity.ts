import { UserEntity } from './../../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('word_data')
export class WordEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eng: string;

  @Column()
  nat: string;

  @ManyToOne(() => UserEntity, {
    nullable: false,
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  group: string;

  @CreateDateColumn({ type: 'timestamp', select: false })
  createdAt: Date;
}
