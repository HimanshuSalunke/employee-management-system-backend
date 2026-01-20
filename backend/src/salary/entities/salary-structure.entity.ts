import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class SalaryStructure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  baseSalary: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  hra: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  allowances: number;
}
