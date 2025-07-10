import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Basic {
  @PrimaryGeneratedColumn({ name: 'basic_uuid' })
  uuidid: string;

  @Column({ name: 'basic_name' })
  name: string;

  @Column({ name: 'basic_status' })
  status: string;
}
