import { IsString, IsOptional, IsBoolean, IsInt } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  target_type: string;

  @IsOptional()
  @IsString()
  target_university?: string;

  @IsOptional()
  @IsString()
  target_faculty?: string;

  @IsOptional()
  @IsInt()
  target_year?: number;

  @IsBoolean()
  is_event: boolean;

  @IsOptional()
  event_date?: Date;
}
