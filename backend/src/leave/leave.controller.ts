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
import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/role.enum';
import { LeaveStatus } from './enums/leave.enums';

@Controller('leave')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  apply(@Request() req, @Body() createLeaveDto: CreateLeaveDto) {
    return this.leaveService.apply(req.user.userId, createLeaveDto);
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.TEAM_LEAD)
  findAll() {
    return this.leaveService.findAll();
  }

  @Get('my-leaves')
  findMyLeaves(@Request() req) {
    return this.leaveService.findByUser(req.user.userId);
  }

  @Patch(':id/status')
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.TEAM_LEAD)
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: LeaveStatus,
    @Request() req,
  ) {
    return this.leaveService.approve(id, req.user.userId, status);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveService.findOne(id);
  }
}
