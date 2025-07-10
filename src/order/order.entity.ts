import { Schedule } from 'src/schedule/schedule.entity';
import { Work } from 'src/work/work.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid', { name: 'order_uuid' })
  uuid: string;
  @Column({ name: 'order_date' })
  date: string;

  @OneToMany(() => Work, (w) => w.order, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  public work: Work[];

  @OneToMany(() => Schedule, (s) => s.order, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  public schedule: Schedule[];
}
