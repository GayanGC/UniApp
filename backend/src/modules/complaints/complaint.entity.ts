import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '@modules/users/entities';

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn()
  complaint_id: number;

  @Column({ length: 255 })
  subject: string;

  @Column('text')
  description: string;

  @Column({ length: 100 })
  category: string;

  @Column({ length: 100 })
  university: string;

  @Column({ type: 'boolean', default: false })
  is_anonymous: boolean;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'submitted_by_user_id' })
  submitted_by_user: User | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submission_date: Date;

  @Column({ length: 50, default: 'Pending' })
  status: string;

  @Column({ type: 'text', nullable: true })
  admin_notes: string | null;
}