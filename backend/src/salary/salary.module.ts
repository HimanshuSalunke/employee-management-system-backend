import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { SalaryService } from './salary.service';
import { SalaryController } from './salary.controller';
import { Salary } from './entities/salary.entity';
import { SalaryStructure } from './entities/salary-structure.entity';
import { SalaryProcessor } from './salary.processor';
import { User } from '../users/entities/user.entity';
import { Attendance } from '../attendance/entities/attendance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Salary, SalaryStructure, User, Attendance]), // Need User & Attendance for Processor
    BullModule.registerQueue({
      name: 'salary',
    }),
  ],
  controllers: [SalaryController],
  providers: [SalaryService, SalaryProcessor],
  exports: [SalaryService],
})
export class SalaryModule {}
