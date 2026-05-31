import { IsString, IsInt, IsOptional } from 'class-validator';

export class FilterNotesDto {
  @IsString()
  @IsOptional()
  university?: string;

  @IsString()
  @IsOptional()
  faculty?: string;

  @IsString()
  @IsOptional()
  subject_code?: string;

  @IsInt()
  @IsOptional()
  academic_year?: number;

  @IsInt()
  @IsOptional()
  page?: number;

  @IsInt()
  @IsOptional()
  limit?: number;
}
