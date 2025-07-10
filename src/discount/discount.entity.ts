import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Discount {
  @PrimaryGeneratedColumn({ name: 'discount_id' })
  id: number;

  @Column({ name: 'discount_name' })
  name: string;

  @Column({ name: 'discount_value' })
  value: number;

  @Column({ name: 'discount_order' })
  order: number;

  @Column({ name: 'discount_count_cleaning_per_month' })
  discountCountCleaningPerMonth: number;

  @Column({ name: 'discount_status' })
  status: string;
}
