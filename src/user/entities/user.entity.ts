import { WordEntity } from './../../word/entities/word.entity';
import {
  Entity,
  OneToMany,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
// import { classToPlain, Exclude } from 'class-transformer';

@Entity('user_data')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column('text', { array: true, default: '{}' })
  groups: string[];

  @OneToMany(() => WordEntity, (word) => word.user)
  words: WordEntity[];

  @Column({ default: false })
  isConfirm: boolean;

  @Column({ default: false })
  isVip: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
