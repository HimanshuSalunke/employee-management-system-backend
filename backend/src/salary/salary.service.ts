import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { SalaryStructure } from './entities/salary-structure.entity';
import { Salary } from './entities/salary.entity';

@Injectable()
export class SalaryService {
  constructor(
    @InjectRepository(SalaryStructure)
    private structRepo: Repository<SalaryStructure>,
    @InjectRepository(Salary) private salaryRepo: Repository<Salary>,
    @InjectQueue('salary') private salaryQueue: Queue,
  ) {}

  async upsertStructure(
    userId: string,
    base: number,
    hra: number = 0,
    allowances: number = 0,
  ) {
    let struct = await this.structRepo.findOneBy({ userId });
    if (struct) {
      struct.baseSalary = base;
      struct.hra = hra;
      struct.allowances = allowances;
    } else {
      struct = this.structRepo.create({
        userId,
        baseSalary: base,
        hra,
        allowances,
      });
    }
    return this.structRepo.save(struct);
  }

  async triggerGeneration(month: number, year: number) {
    await this.salaryQueue.add('generate-monthly', { month, year });
    return { message: 'Salary generation job queued' };
  }

  async findAll() {
    return this.salaryRepo.find({ relations: ['user'] });
  }

  async findByUser(userId: string) {
    return this.salaryRepo.find({
      where: { userId },
      order: { year: 'DESC', month: 'DESC' },
    });
  }

  create(dto: any) {
    return 'use upsertStructure';
  }
  findOne(id: number) {
    return 'not impl';
  }
  update(id: number) {
    return 'not impl';
  }
  remove(id: number) {
    return 'not impl';
  }
}
