import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Entity('study_notes')
export class StudyNote {
  @PrimaryGeneratedColumn()
  note_id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 1000, nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  university: string;

  @Column({ length: 100, nullable: true })
  faculty: string;

  @Column({ length: 50, nullable: true })
  subject_code: string;

  @Column({ nullable: true })
  academic_year: number;

  @Column()
  uploaded_by_user_id: number;

  @Column({ length: 255 })
  file_path: string;

  @Column({ default: false })
  is_approved: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  upload_date: Date;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'uploaded_by_user_id' })
  uploader: User;
}
