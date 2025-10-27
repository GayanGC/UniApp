import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

/**
 * Student Entity
 * Represents the students table in the database
 * Contains additional information for users with student role
 */
@Entity('students')
export class Student {
  @PrimaryGeneratedColumn({ name: 'student_id' })
  studentId: number;

  @Column({ name: 'user_id', type: 'integer', unique: true })
  userId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  university: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  faculty: string;

  @Column({ name: 'academic_year', type: 'varchar', length: 50, nullable: true })
  academicYear: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  // Relationships
  @OneToOne(() => User, (user) => user.student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
