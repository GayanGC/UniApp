import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '@modules/users/entities';
import { BoardingReview } from './boarding-review.entity';

/**
 * BoardingPost Entity
 * Represents the boarding_posts table in the database.
 * Contains accommodation listings created by boarding providers.
 *
 * Changelog:
 *  - Added `images` column: stores an array of server-relative file paths
 *    (e.g. ["/uploads/boarding/abc123.jpg"]).  TypeORM's "simple-array" type
 *    serialises this as a comma-separated TEXT column — no schema migration needed
 *    beyond adding the column.
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

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  longitude: number;

  /**
   * Stored image file paths relative to the server root.
   * e.g. ["/uploads/boarding/abc.jpg", "/uploads/boarding/xyz.jpg"]
   * TypeORM "simple-array" stores this as a single TEXT column with comma-separated values.
   */
  @Column({ name: 'images', type: 'simple-array', nullable: true, default: null })
  images: string[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provider_user_id' })
  provider: User;

  @OneToMany(() => BoardingReview, (review) => review.post)
  reviews: BoardingReview[];
}
