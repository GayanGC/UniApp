import { IsString, IsOptional, MaxLength } from 'class-validator';

/**
 * Update Student Profile DTO
 * Data Transfer Object for updating student profile information
 */
export class UpdateStudentProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'University name must not exceed 255 characters' })
  university?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Faculty name must not exceed 255 characters' })
  faculty?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50, { message: 'Academic year must not exceed 50 characters' })
  academicYear?: string;
}
