import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '@modules/users/entities';
import { UpdateStudentProfileDto } from './dto';

/**
 * Students Service
 * Handles student profile-related business logic
 */
@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  /**
   * Update student profile
   * @param userId - User ID from JWT token
   * @param updateStudentProfileDto - Profile update data
   * @returns Updated student profile
   */
  async updateProfile(
    userId: number,
    updateStudentProfileDto: UpdateStudentProfileDto,
  ): Promise<Student> {
    // Find student profile by user_id
    let student = await this.studentRepository.findOne({
      where: { userId },
    });

    // If student profile doesn't exist, create one
    if (!student) {
      try {
        student = this.studentRepository.create({
          userId,
          university: updateStudentProfileDto.university,
          faculty: updateStudentProfileDto.faculty,
          academicYear: updateStudentProfileDto.academicYear,
        });
        return await this.studentRepository.save(student);
      } catch (error) {
        throw new InternalServerErrorException('Failed to create student profile');
      }
    }

    // Update existing profile
    try {
      if (updateStudentProfileDto.university !== undefined) {
        student.university = updateStudentProfileDto.university;
      }
      if (updateStudentProfileDto.faculty !== undefined) {
        student.faculty = updateStudentProfileDto.faculty;
      }
      if (updateStudentProfileDto.academicYear !== undefined) {
        student.academicYear = updateStudentProfileDto.academicYear;
      }

      return await this.studentRepository.save(student);
    } catch (error) {
      throw new InternalServerErrorException('Failed to update student profile');
    }
  }

  /**
   * Get student profile by user ID
   * @param userId - User ID
   * @returns Student profile if found
   */
  async getProfile(userId: number): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { userId },
      relations: ['user'],
      select: {
        user: {
          userId: true,
          email: true,
          fullName: true,
          role: true,
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student profile not found');
    }

    return student;
  }
}
