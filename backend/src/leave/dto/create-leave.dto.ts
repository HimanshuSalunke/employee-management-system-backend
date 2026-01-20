import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { LeaveType } from '../enums/leave.enums';

export class CreateLeaveDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsEnum(LeaveType)
  type: LeaveType;

  @IsString()
  @IsOptional()
  reason?: string;
}
