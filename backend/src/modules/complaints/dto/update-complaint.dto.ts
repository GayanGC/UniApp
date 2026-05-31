import { IsString, IsOptional } from 'class-validator';

export class UpdateComplaintDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  admin_notes?: string;
}
