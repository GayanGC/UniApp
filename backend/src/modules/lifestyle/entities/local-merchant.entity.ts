import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Campus } from '@modules/campus-guide/entities/campus.entity';

@Entity('local_merchants')
export class LocalMerchant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'text' })
  discountDescription: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  couponCode: string;

  @Column({ name: 'campus_id', type: 'integer' })
  campusId: number;

  @ManyToOne(() => Campus, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'campus_id' })
  campus: Campus;
}
