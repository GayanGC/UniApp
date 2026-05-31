import { IsString, IsBoolean } from 'class-validator';

export class CreateComplaintDto {
  @IsString()
  subject: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsString()
  university: string;

  @IsBoolean()
  is_anonymous: boolean;
}
