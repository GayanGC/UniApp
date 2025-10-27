import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '@common/enums';
import { Student } from './student.entity';

/**
 * User Entity
 * Represents the users table in the database
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  @Exclude() // Exclude password from serialization
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PROSPECTIVE,
  })
  role: UserRole;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  updatedAt: Date;

  // Relationships
  @OneToOne(() => Student, (student) => student.user, { cascade: true })
  student?: Student;
}
