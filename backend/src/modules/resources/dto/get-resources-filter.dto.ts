import { IsOptional, IsString } from 'class-validator';

export class GetResourcesFilterDto {
  @IsOptional()
  @IsString()
  subjectCode?: string;

  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @IsString()
  semester?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
