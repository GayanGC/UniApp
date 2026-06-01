import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '@modules/users/entities';

export enum InvoiceType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum InvoiceStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
}

@Entity('payment_invoices')
export class PaymentInvoice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'enum', enum: InvoiceType })
  type: InvoiceType;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.PENDING })
  status: InvoiceStatus;

  @Column({ type: 'timestamp with time zone' })
  date: Date;

  @Column({ name: 'student_id', type: 'integer' })
  studentId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: User;
}
