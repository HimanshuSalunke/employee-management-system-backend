import { IsBoolean, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateHolidayDto {
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  isRestricted: boolean;
}
