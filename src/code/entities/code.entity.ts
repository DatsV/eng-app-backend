import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('code_data')
export class CodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;
}
