import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { LeaveType, LeaveStatus } from '../enums/leave.enums';

@Entity()
export class Leave {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({ type: 'enum', enum: LeaveType })
  type: LeaveType;

  @Column({ nullable: true })
  reason: string;

  @Column({ type: 'enum', enum: LeaveStatus, default: LeaveStatus.PENDING })
  status: LeaveStatus;

  @ManyToOne(() => User, { nullable: true })
  approver: User;

  @Column({ nullable: true })
  approverId: string;

  @CreateDateColumn()
  createdAt: Date;
}
