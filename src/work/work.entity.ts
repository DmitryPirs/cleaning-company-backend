import { CommonInfo } from 'src/common-info/common-info.entity';
import { ConditionHouse } from 'src/condition-house/condition-house.entity';
import { Order } from 'src/order/order.entity';
import { Team } from 'src/team/team.entity';
import { TypeClean } from 'src/type-clean/type-clean.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Work {
  @PrimaryGeneratedColumn('uuid', { name: 'work_uuid' })
  uuid: string;

  @Column('uuid', { name: 'work_common_info_uuid' })
  commonInfoUuid: string;

  @Column('uuid', { name: 'work_team_uuid' })
  teamUuid: string;

  @Column({ name: 'work_type_clean' })
  typeClean: number;

  @Column({ name: 'work_house_condition' })
  houseCondition: number;

  @Column('date', { name: 'work_date' })
  date: string;

  @Column({ name: 'work_start_time' })
  startTime: number;

  @Column({ name: 'work_finish_time' })
  finishTime: number;

  @Column({ name: 'work_interior_windows' })
  interiorWindows: boolean;

  @Column({ name: 'work_inside_oven' })
  insideOven: boolean;

  @Column({ name: 'work_wipe_baseboards' })
  wipeBaseboards: boolean;

  @Column({ name: 'work_inside_fridge' })
  insideFridge: boolean;

  @Column({ name: 'work_inside_cabinets' })
  insideCabinets: boolean;

  @Column({ name: 'work_pets' })
  pets: boolean;

  @Column('money', { name: 'work_price' })
  price: number;

  @Column({ name: 'work_bedrooms' })
  bedrooms: number;

  @Column({ name: 'work_bathrooms' })
  bathrooms: number;

  @Column({ name: 'work_exclude_bedrooms' })
  excludeBedrooms: number;

  @Column({ name: 'work_exclude_bathrooms' })
  excludeBathrooms: number;

  @Column({ name: 'work_status' })
  status: string;

  @Column('uuid', { name: 'work_order_uuid' })
  orderUuid: string;

  @ManyToOne(() => TypeClean, (tc) => tc.work, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'work_type_clean', referencedColumnName: 'id' }])
  typeCleaning: TypeClean;

  @ManyToOne(() => ConditionHouse, (ch) => ch.work, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'work_house_condition', referencedColumnName: 'id' }])
  conditionHouse: ConditionHouse;

  @ManyToOne(() => CommonInfo, (ci) => ci.work, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'work_common_info_uuid', referencedColumnName: 'uuid' }])
  commonInfo: CommonInfo;

  @ManyToOne(() => Team, (t) => t.work, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'work_team_uuid', referencedColumnName: 'uuid' }])
  team: Team;

  @ManyToOne(() => Order, (o) => o.work, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'work_order_uuid', referencedColumnName: 'uuid' }])
  order: Order;
}
