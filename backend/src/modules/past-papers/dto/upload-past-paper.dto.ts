import { IsString, IsNotEmpty, IsInt, Min, Max, MaxLength } from 'class-validator';

/**
 * Upload Past Paper DTO
 * Data Transfer Object for uploading a past paper
 */
export class UploadPastPaperDto {
  @IsString()
  @IsNotEmpty({ message: 'University is required' })
  @MaxLength(255, { message: 'University name must not exceed 255 characters' })
  university: string;

  @IsString()
  @IsNotEmpty({ message: 'Faculty is required' })
  @MaxLength(255, { message: 'Faculty name must not exceed 255 characters' })
  faculty: string;

  @IsString()
  @IsNotEmpty({ message: 'Subject name is required' })
  @MaxLength(255, { message: 'Subject name must not exceed 255 characters' })
  subjectName: string;

  @IsInt({ message: 'Academic year must be an integer' })
  @Min(1, { message: 'Academic year must be at least 1' })
  @Max(10, { message: 'Academic year must not exceed 10' })
  academicYear: number;

  @IsInt({ message: 'Exam year must be an integer' })
  @Min(1900, { message: 'Exam year must be at least 1900' })
  @Max(2100, { message: 'Exam year must not exceed 2100' })
  examYear: number;
}
