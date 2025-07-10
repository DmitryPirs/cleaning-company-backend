import { CommonInfo } from 'src/common-info/common-info.entity';
import { Order } from 'src/order/order.entity';
import { Team } from 'src/team/team.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
@Entity()
export class Schedule {
  @PrimaryGeneratedColumn('uuid', { name: 'schedule_uuid' })
  uuid: string;
  @Column({ name: 'schedule_common_info_uuid' })
  commonInfoUuid: string;
  @Column({ name: 'schedule_team_uuid' })
  teamUuid: string;
  @Column({ name: 'schedule_day_of_week' })
  dayOfWeek: number;
  @Column({ name: 'schedule_number_of_week' })
  numberOfWeek: number;
  @Column({ name: 'schedule_start_time' })
  startTime: number;
  @Column({ name: 'schedule_finish_time' })
  finishTime: number;
  @Column('money', { name: 'schedule_price' })
  price: number;

  @Column({ name: 'schedule_bedrooms' })
  bedrooms: number;

  @Column({ name: 'schedule_bathrooms' })
  bathrooms: number;

  @Column({ name: 'schedule_exclude_bedrooms' })
  excludeBedrooms: number;

  @Column({ name: 'schedule_exclude_bathrooms' })
  excludeBathrooms: number;

  @Column({ name: 'schedule_status' })
  status: string;

  @Column('uuid', { name: 'schedule_order_uuid' })
  orderUuid: string;

  @ManyToOne(() => CommonInfo, (ci) => ci.schedule, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([
    { name: 'schedule_common_info_uuid', referencedColumnName: 'uuid' },
  ])
  commonInfo: CommonInfo;

  @ManyToOne(() => Team, (t) => t.schedule, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'schedule_team_uuid', referencedColumnName: 'uuid' }])
  team: Team;

  @ManyToOne(() => Order, (o) => o.schedule, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'schedule_order_uuid', referencedColumnName: 'uuid' }])
  order: Order;
}
