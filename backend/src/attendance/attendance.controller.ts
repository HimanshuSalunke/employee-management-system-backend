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
  Query,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/role.enum';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  clockIn(@Request() req) {
    return this.attendanceService.clockIn(req.user.userId);
  }

  @Post('clock-out')
  clockOut(@Request() req) {
    return this.attendanceService.clockOut(req.user.userId);
  }

  @Get('my-attendance')
  findMyAttendance(
    @Request() req,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.attendanceService.findByUser(req.user.userId, month, year);
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.TEAM_LEAD)
  findAll(@Query('month') month?: number, @Query('year') year?: number) {
    return this.attendanceService.findAll(month, year);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }
}
