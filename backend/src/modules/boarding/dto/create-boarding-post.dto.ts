import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, Min, MaxLength } from 'class-validator';

/**
 * Create Boarding Post DTO
 * Data Transfer Object for creating a new boarding post
 */
export class CreateBoardingPostDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Monthly rent is required' })
  @Min(0, { message: 'Monthly rent must be a positive number' })
  monthlyRent: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Location details must not exceed 500 characters' })
  locationDetails?: string;
}
