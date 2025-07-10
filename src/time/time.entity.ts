import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Time {
  @PrimaryGeneratedColumn({ name: 'time_id' })
  id: number;

  @Column({ name: 'time_name' })
  name: string;

  @Column({ name: 'time_order' })
  order: number;

  @Column({ name: 'time_status' })
  status: string;
}
