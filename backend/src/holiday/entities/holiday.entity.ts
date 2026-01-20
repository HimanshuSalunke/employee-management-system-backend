import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Holiday {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column()
  name: string;

  @Column({ default: false })
  isRestricted: boolean; // True for RH
}
