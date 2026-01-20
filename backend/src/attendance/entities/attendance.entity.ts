import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AttendanceStatus } from '../enums/attendance-status.enum';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string; // Explicit FK column for easier querying

  @Column({ type: 'date' })
  date: string; // YYYY-MM-DD

  @Column({ type: 'timestamp', nullable: true })
  clockIn: Date;

  @Column({ type: 'timestamp', nullable: true })
  clockOut: Date;

  @Column({ type: 'float', nullable: true })
  workHours: number;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.ABSENT,
  })
  status: AttendanceStatus;
}
