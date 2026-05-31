import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) {}

  async createNotification(dto: CreateNotificationDto, userId: number): Promise<Notification> {
    // Validation for required targeting fields
    if (dto.target_type === 'University-Specific' && !dto.target_university) {
      throw new BadRequestException(
        'target_university is required for University-Specific notifications',
      );
    }
    if (dto.target_type === 'Faculty-Specific' && (!dto.target_university || !dto.target_faculty)) {
      throw new BadRequestException(
        'target_university and target_faculty are required for Faculty-Specific notifications',
      );
    }
    if (dto.is_event && !dto.event_date) {
      throw new BadRequestException('event_date is required for event notifications');
    }
    const notification = this.notificationsRepository.create({
      ...dto,
      user: { userId: userId },
    });
    return await this.notificationsRepository.save(notification);
  }

  async getStudentFeed(studentProfile: {
    university: string;
    faculty: string;
    academic_year: number;
  }): Promise<Notification[]> {
    const { university, faculty, academic_year } = studentProfile;
    return await this.notificationsRepository
      .createQueryBuilder('notification')
      .where('notification.target_type = :general', { general: 'General' })
      .orWhere(
        '(notification.target_university = :university AND notification.target_faculty = :faculty AND notification.target_year = :year)',
        { university, faculty, year: academic_year },
      )
      .orWhere(
        '(notification.target_university = :university AND notification.target_faculty = :faculty AND notification.target_year IS NULL)',
        { university, faculty },
      )
      .orWhere(
        '(notification.target_university = :university AND notification.target_faculty IS NULL AND notification.target_year IS NULL)',
        { university },
      )
      .orderBy('notification.posted_at', 'DESC')
      .getMany();
  }
}