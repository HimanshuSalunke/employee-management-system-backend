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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from './enums/role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.ADMIN) // Only Admin can create
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('profile')
  getProfile(@Request() req) {
    // Accessible by any authenticated user
    return this.usersService.findOne(req.user.userId);
  }

  @Get()
  @Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.TEAM_LEAD)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch(':id/leave-balance')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  updateLeaveBalance(
    @Param('id') id: string,
    @Body('balance') balance: number,
  ) {
    return this.usersService.updateLeaveBalance(id, balance);
  }
}
