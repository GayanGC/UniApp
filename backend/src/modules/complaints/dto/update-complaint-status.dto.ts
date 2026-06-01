import { IsEnum, IsNotEmpty } from 'class-validator';
import { ComplaintStatus } from '../complaint.entity';

export class UpdateComplaintStatusDto {
  @IsEnum(ComplaintStatus)
  @IsNotEmpty()
  status: ComplaintStatus;
}
