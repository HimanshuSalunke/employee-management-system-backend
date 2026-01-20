import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Salary {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @Column()
  month: number; // 1-12

  @Column()
  year: number;

  @Column('decimal', { precision: 10, scale: 2 })
  netSalary: number;

  @Column('decimal', { precision: 10, scale: 2 })
  deductions: number;

  @Column('decimal', { precision: 10, scale: 2 })
  earnings: number;

  @CreateDateColumn()
  generatedAt: Date;
}
