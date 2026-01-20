import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.EMPLOYEE })
  role: UserRole;

  @Column({ default: 12 })
  leaveBalance: number;

  @ManyToOne(() => User, (user) => user.subordinates, { nullable: true })
  manager: User;

  @OneToMany(() => User, (user) => user.manager)
  subordinates: User[];

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  designation: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
