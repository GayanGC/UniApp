import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Campus } from './campus.entity';

/**
 * CampusPOI Entity
 * Represents the campus_pois table in the database
 * Contains Points of Interest around campuses
 */
@Entity('campus_pois')
export class CampusPOI {
  @PrimaryGeneratedColumn({ name: 'poi_id' })
  poiId: number;

  @Column({ name: 'campus_id', type: 'integer' })
  campusId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Campus, (campus) => campus.pois, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'campus_id' })
  campus: Campus;
}
