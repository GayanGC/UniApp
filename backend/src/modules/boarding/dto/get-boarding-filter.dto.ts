import { IsString, IsNumber, IsBoolean, IsOptional, Min } from 'class-validator';
import { Transform, Type } from 'class-transformer';

/**
 * Get Boarding Filter DTO
 * Validates and transforms query parameters for filtering boarding posts.
 *
 * Usage: GET /api/v1/boarding?location=colombo&minPrice=100&maxPrice=500&available=true
 */
export class GetBoardingFilterDto {
  /**
   * Partial, case-insensitive match on the location_details column.
   * e.g. ?location=colombo  →  WHERE location_details ILIKE '%colombo%'
   */
  @IsString()
  @IsOptional()
  location?: string;

  /**
   * Minimum monthly rent (inclusive).
   * e.g. ?minPrice=150  →  WHERE monthly_rent >= 150
   * @Type(Number) converts the raw query string to a JS number before validation.
   */
  @Type(() => Number)
  @IsNumber({}, { message: 'minPrice must be a valid number' })
  @Min(0, { message: 'minPrice must be a non-negative number' })
  @IsOptional()
  minPrice?: number;

  /**
   * Maximum monthly rent (inclusive).
   * e.g. ?maxPrice=500  →  WHERE monthly_rent <= 500
   */
  @Type(() => Number)
  @IsNumber({}, { message: 'maxPrice must be a valid number' })
  @Min(0, { message: 'maxPrice must be a non-negative number' })
  @IsOptional()
  maxPrice?: number;

  /**
   * Filter by availability status.
   * Accepts 'true' / 'false' strings from the query string and transforms them to booleans.
   * e.g. ?available=true  →  WHERE is_available = true
   */
  @Transform(({ value }: { value: string }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value; // let class-validator reject any other value
  })
  @IsBoolean({ message: 'available must be a boolean (true or false)' })
  @IsOptional()
  available?: boolean;
}
