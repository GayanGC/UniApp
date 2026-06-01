import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateBoardingReviewDto {
  @IsInt()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must not exceed 5' })
  rating: number;

  @IsString()
  @IsNotEmpty({ message: 'Comment is required' })
  comment: string;
}
