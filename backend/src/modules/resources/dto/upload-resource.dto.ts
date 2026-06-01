import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class UploadResourceDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  subjectCode: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['1st Year', '2nd Year', '3rd Year', '4th Year', 'Other'])
  year: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['1', '2'])
  semester: string; // From FormData, everything comes as string. We'll parse it to int in service.

  @IsString()
  @IsNotEmpty()
  @IsIn(['past-paper', 'lecture-note'])
  type: string;
}
