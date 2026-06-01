import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '@modules/users/entities';

@Entity('resource_items')
export class ResourceItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'subject_code', type: 'varchar', length: 50 })
  subjectCode: string;

  @Column({ type: 'varchar', length: 50 })
  year: string;

  @Column({ type: 'int' })
  semester: number;

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ name: 'file_path', type: 'varchar', length: 500 })
  filePath: string;

  @Column({ name: 'uploader_id', type: 'integer' })
  uploaderId: number;

  @CreateDateColumn({ name: 'uploaded_at', type: 'timestamp with time zone' })
  uploadedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uploader_id' })
  uploader: User;
}
