import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Campus } from '@modules/campus-guide/entities/campus.entity';

@Entity('campus_events')
export class CampusEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp with time zone' })
  date: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  registrationLink: string;

  @Column({ name: 'campus_id', type: 'integer' })
  campusId: number;

  @ManyToOne(() => Campus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'campus_id' })
  campus: Campus;
}
