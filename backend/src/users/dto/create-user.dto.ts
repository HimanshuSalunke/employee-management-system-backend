import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
} from 'class-validator';
import { UserRole } from '../enums/role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsUUID()
  @IsOptional()
  managerId?: string;

  @IsString()
  @IsOptional()
  designation?: string;
}
