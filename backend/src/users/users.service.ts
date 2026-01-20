import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRole } from './enums/role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    if (createUserDto.managerId) {
      const manager = await this.usersRepository.findOne({
        where: { id: createUserDto.managerId },
      });
      if (!manager || manager.role === UserRole.EMPLOYEE) {
        throw new ConflictException(
          'Manager must be a Team Lead, Admin, or Owner',
        );
      }
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      manager: createUserDto.managerId
        ? { id: createUserDto.managerId }
        : undefined,
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['manager'] });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['manager', 'subordinates'],
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role'], // Explicitly select password for auth
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.managerId && updateUserDto.managerId === id) {
      throw new ConflictException('User cannot report to themselves');
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.managerId) {
      const manager = await this.usersRepository.findOne({
        where: { id: updateUserDto.managerId },
      });
      if (!manager || manager.role === UserRole.EMPLOYEE) {
        throw new ConflictException(
          'Manager must be a Team Lead, Admin, or Owner',
        );
      }
    }

    await this.usersRepository.update(id, {
      ...updateUserDto,
      manager: updateUserDto.managerId
        ? { id: updateUserDto.managerId }
        : undefined,
    });
    return this.findOne(id);
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    return this.usersRepository.remove(user);
  }

  async updateLeaveBalance(id: string, balance: number) {
    await this.usersRepository.update(id, { leaveBalance: balance });
    return this.findOne(id);
  }
}
