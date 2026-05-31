import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Complaint } from './complaint.entity';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private complaintsRepository: Repository<Complaint>,
  ) {}

  async submitComplaint(dto: CreateComplaintDto, userId: number | null): Promise<Complaint> {
    const complaint = this.complaintsRepository.create({
      ...dto,
      submitted_by_user: userId ? { userId: userId } : null,
      status: 'Pending',
    });
    return await this.complaintsRepository.save(complaint);
  }

  async getAllComplaints(page = 1, limit = 20): Promise<[Complaint[], number]> {
    return await this.complaintsRepository.findAndCount({
      relations: ['submitted_by_user'],
      order: { submission_date: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async updateComplaint(complaintId: number, dto: UpdateComplaintDto): Promise<Complaint> {
    const complaint = await this.complaintsRepository.findOne({
      where: { complaint_id: complaintId },
    });
    if (!complaint) throw new Error('Complaint not found');
    Object.assign(complaint, dto);
    return await this.complaintsRepository.save(complaint);
  }
}