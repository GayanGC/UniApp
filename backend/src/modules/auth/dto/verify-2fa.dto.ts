import { IsNotEmpty, IsString, Length } from 'class-validator';

export class Verify2FADto {
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;
}

export class Authenticate2FADto extends Verify2FADto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
