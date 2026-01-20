import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SalaryService } from './salary.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/role.enum';

@Controller('salary')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Post('structure')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  upsertStructure(
    @Body()
    body: {
      userId: string;
      base: number;
      hra?: number;
      allowances?: number;
    },
  ) {
    return this.salaryService.upsertStructure(
      body.userId,
      body.base,
      body.hra,
      body.allowances,
    );
  }

  @Post('generate')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  triggerGeneration(@Body() body: { month: number; year: number }) {
    return this.salaryService.triggerGeneration(body.month, body.year);
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  findAll() {
    return this.salaryService.findAll();
  }

  @Get('my-salary')
  findMySalary(@Request() req) {
    return this.salaryService.findByUser(req.user.userId);
  }
}
