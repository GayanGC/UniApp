import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, IsBoolean, IsOptional } from 'class-validator';
import { UserRole } from '@common/enums';

/**
 * Create User DTO
 * Data Transfer Object for creating a new user
 */
export class CreateUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @IsEnum(UserRole, { message: 'Invalid user role' })
  @IsNotEmpty({ message: 'Role is required' })
  role: UserRole;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
