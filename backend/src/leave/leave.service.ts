import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto'; // Won't use generated update
import { Leave } from './entities/leave.entity';
import { LeaveStatus } from './enums/leave.enums';

@Injectable()
export class LeaveService {
  constructor(
    @InjectRepository(Leave)
    private leaveRepository: Repository<Leave>,
  ) {}

  async apply(userId: string, createLeaveDto: CreateLeaveDto) {
    // Check for overlap
    const existing = await this.leaveRepository
      .createQueryBuilder('leave')
      .where('leave.userId = :userId', { userId })
      .andWhere('leave.status IN (:...statuses)', {
        statuses: [LeaveStatus.PENDING, LeaveStatus.APPROVED],
      })
      .andWhere('(leave.startDate <= :end AND leave.endDate >= :start)', {
        start: createLeaveDto.startDate,
        end: createLeaveDto.endDate,
      })
      .getOne();

    if (existing) {
      throw new ConflictException(
        'Leave request overlaps with an existing application',
      );
    }

    const leave = this.leaveRepository.create({
      ...createLeaveDto,
      userId,
    });
    return this.leaveRepository.save(leave);
  }

  async findAll() {
    return this.leaveRepository.find({ relations: ['user'] });
  }

  async findOne(id: string) {
    return this.leaveRepository.findOne({ where: { id }, relations: ['user'] });
  }

  async approve(id: string, approverId: string, status: LeaveStatus) {
    const leave = await this.findOne(id);
    if (!leave) throw new NotFoundException('Leave request not found');

    leave.status = status;
    leave.approverId = approverId;

    if (status === LeaveStatus.APPROVED) {
      leave.user.leaveBalance -= 1; // Simple deduction logic
      await this.leaveRepository.manager.save(leave.user);
    }

    return this.leaveRepository.save(leave);
  }

  async findByUser(userId: string) {
    return this.leaveRepository.find({
      where: { userId },
      order: { startDate: 'DESC' },
    });
  }

  create(dto: CreateLeaveDto) {
    return 'use apply';
  }
  update(id: number, dto: any) {
    return 'use approve';
  }
  remove(id: number) {
    return 'restricted';
  }
}
