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
 * BoardingPost Entity
 * Represents the boarding_posts table in the database
 * Contains accommodation listings created by boarding providers
 */
@Entity('boarding_posts')
export class BoardingPost {
  @PrimaryGeneratedColumn({ name: 'post_id' })
  postId: number;

  @Column({ name: 'provider_user_id', type: 'integer' })
  providerUserId: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'monthly_rent', type: 'decimal', precision: 10, scale: 2 })
  monthlyRent: number;

  @Column({ name: 'is_available', type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({ name: 'location_details', type: 'varchar', length: 500, nullable: true })
  locationDetails: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provider_user_id' })
  provider: User;
}
