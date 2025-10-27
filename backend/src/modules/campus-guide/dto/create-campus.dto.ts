import { IsString, IsNotEmpty, IsNumber, Min, Max, MaxLength } from 'class-validator';

/**
 * Create Campus DTO
 * Data Transfer Object for creating a new campus
 */
export class CreateCampusDto {
  @IsString()
  @IsNotEmpty({ message: 'Campus name is required' })
  @MaxLength(255, { message: 'Campus name must not exceed 255 characters' })
  name: string;

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
  @IsNotEmpty({ message: 'Address is required' })
  @MaxLength(500, { message: 'Address must not exceed 500 characters' })
  address: string;
}
