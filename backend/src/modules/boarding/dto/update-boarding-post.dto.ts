import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, Min, MaxLength } from 'class-validator';

/**
 * Update Boarding Post DTO
 * Data Transfer Object for updating an existing boarding post
 */
export class UpdateBoardingPostDto {
  @IsString()
  @IsOptional()
  @MaxLength(255, { message: 'Title must not exceed 255 characters' })
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Monthly rent must be a positive number' })
  monthlyRent?: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Location details must not exceed 500 characters' })
  locationDetails?: string;

  /** Replaced image paths — set by the controller after Multer processes uploads */
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
