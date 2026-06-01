import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnonymousComplaint } from './entities/anonymous-complaint.entity';
import { CreateAnonymousComplaintDto } from './dto/create-anonymous-complaint.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SafetyService {
  constructor(
    @InjectRepository(AnonymousComplaint)
    private readonly complaintRepository: Repository<AnonymousComplaint>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async submitAnonymousComplaint(dto: CreateAnonymousComplaintDto) {
    try {
      const complaint = this.complaintRepository.create({
        incidentDescription: dto.incidentDescription,
        location: dto.location,
        dateOfIncident: new Date(dto.dateOfIncident),
        isUrgent: dto.isUrgent,
      });

      const savedComplaint = await this.complaintRepository.save(complaint);

      const welfareEmail = this.configService.get<string>('WELFARE_EMAIL') || 'welfare@university.edu';

      // Send email asynchronously (don't await it to fail the request if SMTP fails)
      this.mailerService.sendMail({
        to: welfareEmail,
        subject: dto.isUrgent ? 'URGENT: Anti-Ragging Anonymous Report' : 'Anti-Ragging Anonymous Report',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ff4d4d; border-radius: 8px;">
            <h2 style="color: #ff4d4d;">Anonymous Anti-Ragging Report</h2>
            <p><strong>Incident ID:</strong> ${savedComplaint.id}</p>
            <p><strong>Date of Incident:</strong> ${savedComplaint.dateOfIncident.toISOString()}</p>
            <p><strong>Location:</strong> ${savedComplaint.location}</p>
            <p><strong>Urgency:</strong> ${savedComplaint.isUrgent ? '<span style="color:red; font-weight:bold;">HIGH</span>' : 'Normal'}</p>
            <hr />
            <h3>Description:</h3>
            <p style="background: #f9f9f9; padding: 15px; border-radius: 5px;">${savedComplaint.incidentDescription}</p>
            <hr />
            <small style="color: #888;">This report was submitted via the UniApp Anonymous Portal. Sender identity is entirely stripped.</small>
          </div>
        `,
      }).catch(err => console.error('Failed to dispatch anti-ragging email:', err));

      return { success: true, message: 'Report submitted anonymously and safely.' };
    } catch (err) {
      throw new InternalServerErrorException('Failed to submit anonymous report.');
    }
  }
}
