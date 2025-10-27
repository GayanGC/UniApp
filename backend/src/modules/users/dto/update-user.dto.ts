import { IsEmail, IsEnum, IsString, MinLength, IsBoolean, IsOptional } from 'class-validator';
import { UserRole } from '@common/enums';

/**
 * Update User DTO
 * Data Transfer Object for updating an existing user
 */
export class UpdateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEnum(UserRole, { message: 'Invalid user role' })
  @IsOptional()
  role?: UserRole;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
