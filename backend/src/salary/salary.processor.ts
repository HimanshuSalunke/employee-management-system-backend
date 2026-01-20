import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Salary } from './entities/salary.entity';
import { SalaryStructure } from './entities/salary-structure.entity';
import { User } from '../users/entities/user.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { AttendanceStatus } from '../attendance/enums/attendance-status.enum';
import { Logger } from '@nestjs/common';

@Processor('salary')
export class SalaryProcessor extends WorkerHost {
  private readonly logger = new Logger(SalaryProcessor.name);

  constructor(
    @InjectRepository(Salary) private salaryRepository: Repository<Salary>,
    @InjectRepository(SalaryStructure)
    private salaryStructureRepository: Repository<SalaryStructure>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { month, year } = job.data;
    this.logger.log(`Starting Salary Generation for ${month}/${year}`);

    // Fetch all users
    const users = await this.userRepository.find();

    for (const user of users) {
      // 1. Get Structure
      const structure = await this.salaryStructureRepository.findOneBy({
        userId: user.id,
      });
      if (!structure) {
        this.logger.warn(`No salary structure for user ${user.id}`);
        continue;
      }

      // 2. Calculate Attendance (Simple: Count 'PRESENT' and 'HALF_DAY')
      // Note: In real world, use raw query or range query. Here fetching all and filtering (not optimal but simple)
      const attendances = await this.attendanceRepository
        .createQueryBuilder('att')
        .where('att.userId = :uid', { uid: user.id })
        .andWhere('EXTRACT(MONTH FROM att.date) = :month', { month })
        .andWhere('EXTRACT(YEAR FROM att.date) = :year', { year })
        .getMany();

      let payableDays = 0;
      for (const att of attendances) {
        if (att.status === AttendanceStatus.PRESENT) payableDays += 1;
        if (att.status === AttendanceStatus.HALF_DAY) payableDays += 0.5;
      }

      // 3. Calculate Amount
      const dailyRate = Number(structure.baseSalary) / 30; // Assuming 30 days
      const earnings = dailyRate * payableDays;
      const deductions = Number(structure.baseSalary) - earnings; // Basic Loss of Pay logic

      // 4. Save
      const salary = this.salaryRepository.create({
        userId: user.id,
        month,
        year,
        earnings,
        deductions,
        netSalary: earnings + Number(structure.allowances),
        generatedAt: new Date(),
      });

      await this.salaryRepository.save(salary);
    }

    this.logger.log(`Salary Generation Completed for ${month}/${year}`);
  }
}
