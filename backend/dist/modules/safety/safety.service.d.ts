import { Repository } from 'typeorm';
import { AnonymousComplaint } from './entities/anonymous-complaint.entity';
import { CreateAnonymousComplaintDto } from './dto/create-anonymous-complaint.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
export declare class SafetyService {
    private readonly complaintRepository;
    private readonly mailerService;
    private readonly configService;
    constructor(complaintRepository: Repository<AnonymousComplaint>, mailerService: MailerService, configService: ConfigService);
    submitAnonymousComplaint(dto: CreateAnonymousComplaintDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
