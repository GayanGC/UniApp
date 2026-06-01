import { IsNotEmpty, IsString, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnonymousComplaintDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  incidentDescription: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  dateOfIncident: string;

  @ApiProperty()
  @IsBoolean()
  isUrgent: boolean;
}
