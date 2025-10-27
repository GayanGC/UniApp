import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, Max, MaxLength } from 'class-validator';

/**
 * Create POI DTO
 * Data Transfer Object for creating a new Point of Interest
 */
export class CreatePOIDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Campus ID is required' })
  campusId: number;

  @IsString()
  @IsNotEmpty({ message: 'POI name is required' })
  @MaxLength(255, { message: 'POI name must not exceed 255 characters' })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'Description must not exceed 500 characters' })
  description?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Latitude is required' })
  @Min(-90, { message: 'Latitude must be between -90 and 90' })
  @Max(90, { message: 'Latitude must be between -90 and 90' })
  latitude: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Longitude is required' })
  @Min(-180, { message: 'Longitude must be between -180 and 180' })
  @Max(180, { message: 'Longitude must be between -180 and 180' })
  longitude: number;

  @IsString()
  @IsNotEmpty({ message: 'Category is required' })
  @MaxLength(100, { message: 'Category must not exceed 100 characters' })
  category: string;
}
