import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { Holiday } from './entities/holiday.entity';

@Injectable()
export class HolidayService {
  constructor(
    @InjectRepository(Holiday)
    private holidayRepository: Repository<Holiday>,
  ) {}

  create(createHolidayDto: CreateHolidayDto) {
    const holiday = this.holidayRepository.create(createHolidayDto);
    return this.holidayRepository.save(holiday);
  }

  async findAll(year?: number) {
    if (year) {
      return this.holidayRepository
        .createQueryBuilder('holiday')
        .where('EXTRACT(YEAR FROM holiday.date) = :year', { year })
        .orderBy('holiday.date', 'ASC')
        .getMany();
    }
    return this.holidayRepository.find({ order: { date: 'ASC' } });
  }

  findOne(id: string) {
    return this.holidayRepository.findOneBy({ id });
  }

  async update(id: string, updateHolidayDto: any) {
    await this.holidayRepository.update(id, updateHolidayDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    return this.holidayRepository.delete(id);
  }
}
