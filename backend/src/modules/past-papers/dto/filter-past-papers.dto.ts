import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Filter Past Papers DTO
 * Data Transfer Object for filtering past papers
 */
export class FilterPastPapersDto {
  @IsOptional()
  @IsString()
  university?: string;

  @IsOptional()
  @IsString()
  faculty?: string;

  @IsOptional()
  @IsString()
  subjectName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  academicYear?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1900)
  examYear?: number;
}
