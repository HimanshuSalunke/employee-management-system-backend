import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';
import { AttendanceStatus } from './enums/attendance-status.enum';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
  ) {}

  async clockIn(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const existing = await this.attendanceRepository.findOne({
      where: { userId, date: today },
    });

    if (existing) {
      throw new BadRequestException('Already clocked in today');
    }

    const attendance = this.attendanceRepository.create({
      userId,
      date: today,
      clockIn: new Date(),
      status: AttendanceStatus.PRESENT,
    });
    return this.attendanceRepository.save(attendance);
  }

  async clockOut(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    const attendance = await this.attendanceRepository.findOne({
      where: { userId, date: today },
    });

    if (!attendance) {
      throw new NotFoundException('No attendance record found for today');
    }

    attendance.clockOut = new Date();
    // Calculate hours (Time difference in milliseconds / 1000 / 3600)
    const diff = attendance.clockOut.getTime() - attendance.clockIn.getTime();
    attendance.workHours = diff / (1000 * 3600);

    return this.attendanceRepository.save(attendance);
  }

  async findByUser(userId: string, month?: number, year?: number) {
    const query = this.attendanceRepository
      .createQueryBuilder('att')
      .where('att.userId = :userId', { userId });

    if (month && year) {
      query
        .andWhere('EXTRACT(MONTH FROM att.date) = :month', { month })
        .andWhere('EXTRACT(YEAR FROM att.date) = :year', { year });
    }

    return query.getMany();
  }

  async findAll(month?: number, year?: number) {
    if (month && year) {
      return this.attendanceRepository
        .createQueryBuilder('att')
        .where('EXTRACT(MONTH FROM att.date) = :month', { month })
        .andWhere('EXTRACT(YEAR FROM att.date) = :year', { year })
        .getMany();
    }
    return this.attendanceRepository.find();
  }

  async findOne(id: string) {
    return this.attendanceRepository.findOneBy({ id });
  }

  // Auto-generated placeholders
  create(createAttendanceDto: CreateAttendanceDto) {
    return 'Use clockIn instead';
  }
  update(id: number, updateAttendanceDto: UpdateAttendanceDto) {
    return 'Use clockOut or specific update';
  }
  remove(id: number) {
    return 'Restricted';
  }
}
