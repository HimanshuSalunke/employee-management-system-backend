import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { CreateHolidayDto } from './dto/create-holiday.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/role.enum';

@Controller('holiday')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Post()
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  create(@Body() createHolidayDto: CreateHolidayDto) {
    return this.holidayService.create(createHolidayDto);
  }

  @Get()
  findAll(@Query('year') year?: number) {
    return this.holidayService.findAll(year);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.holidayService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() body: any) {
    return this.holidayService.update(id, body);
  }

  @Delete(':id')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.holidayService.remove(id);
  }
}
