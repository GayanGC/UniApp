import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@modules/users/entities';

/**
 * PastPaper Entity
 * Represents the past_papers table in the database
 * Contains examination papers uploaded by administrators
 */
@Entity('past_papers')
export class PastPaper {
  @PrimaryGeneratedColumn({ name: 'paper_id' })
  paperId: number;

  @Column({ type: 'varchar', length: 255 })
  university: string;

  @Column({ type: 'varchar', length: 255 })
  faculty: string;

  @Column({ name: 'subject_name', type: 'varchar', length: 255 })
  subjectName: string;

  @Column({ name: 'academic_year', type: 'integer' })
  academicYear: number;

  @Column({ name: 'exam_year', type: 'integer' })
  examYear: number;

  @Column({ name: 'file_path', type: 'varchar', length: 500 })
  filePath: string;

  @Column({ name: 'uploaded_by_user_id', type: 'integer' })
  uploadedByUserId: number;

  @Column({ name: 'is_approved', type: 'boolean', default: false })
  isApproved: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uploaded_by_user_id' })
  uploadedBy: User;
}
