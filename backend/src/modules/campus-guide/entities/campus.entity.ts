import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { CampusPOI } from './campus-poi.entity';

/**
 * Campus Entity
 * Represents the campuses table in the database
 * Contains static data for main universities
 */
@Entity('campuses')
export class Campus {
  @PrimaryGeneratedColumn({ name: 'campus_id' })
  campusId: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitude: number;

  @Column({ type: 'varchar', length: 500 })
  address: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => CampusPOI, (poi) => poi.campus)
  pois: CampusPOI[];
}
