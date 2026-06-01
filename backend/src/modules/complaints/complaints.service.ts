import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Complaint, ComplaintStatus } from './complaint.entity';
import { CreateComplaintDto, UpdateComplaintStatusDto } from './dto';
import { NotificationsGateway } from '@modules/notifications/notifications.gateway';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintRepository: Repository<Complaint>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async createComplaint(studentId: number, dto: CreateComplaintDto): Promise<Complaint> {
    const complaint = this.complaintRepository.create({
      title: dto.title,
      description: dto.description,
      category: dto.category,
      studentId,
      status: ComplaintStatus.PENDING,
    });
    return await this.complaintRepository.save(complaint);
  }

  async getStudentComplaints(studentId: number): Promise<Complaint[]> {
    return await this.complaintRepository.find({
      where: { studentId },
      order: { createdAt: 'DESC' },
    });
  }

  async getAllComplaints(): Promise<Complaint[]> {
    return await this.complaintRepository.find({
      relations: ['student'],
      select: {
        student: {
          userId: true,
          fullName: true,
          email: true,
        },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async updateComplaintStatus(id: string, dto: UpdateComplaintStatusDto): Promise<Complaint> {
    const complaint = await this.complaintRepository.findOne({ where: { id } });
    if (!complaint) {
      throw new NotFoundException('Complaint not found');
    }

    complaint.status = dto.status;
    const updated = await this.complaintRepository.save(complaint);

    // Notify student via Socket.IO
    this.notificationsGateway.sendToUser(complaint.studentId, {
      id: uuidv4(),
      title: 'Complaint Status Updated',
      message: `Your complaint "${complaint.title}" has been updated to ${dto.status}.`,
      type: 'info',
      createdAt: new Date().toISOString(),
    });

    return updated;
  }
}