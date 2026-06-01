import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BoardingPost } from './boarding-post.entity';
import { User } from '@modules/users/entities';

@Entity('boarding_reviews')
export class BoardingReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'post_id', type: 'integer' })
  postId: number;

  @Column({ name: 'student_user_id', type: 'integer' })
  studentUserId: number;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @ManyToOne(() => BoardingPost, (post) => post.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'post_id' })
  post: BoardingPost;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_user_id' })
  student: User;
}
