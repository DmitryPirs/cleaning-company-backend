import { Client } from 'src/client/client.entity';
import { House } from 'src/house/house.entity';
import { Schedule } from 'src/schedule/schedule.entity';
import { Work } from 'src/work/work.entity';
import { Zipcode } from 'src/zipcode/zipcode.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
// import { User } from 'src/user/user.entity';

@Entity()
export class CommonInfo {
  @PrimaryGeneratedColumn('uuid', { name: 'common_info_uuid' })
  uuid: string;

  @Column({ name: 'common_info_client_uuid' })
  clientUuid: string;

  @Column({ name: 'common_info_house_uuid' })
  houseUuid: string;

  @Column({ name: 'common_info_zip_code' })
  zipCode: number;

  @Column({ name: 'common_info_square_feet' })
  squareFeet: number;

  @Column('money', { name: 'common_info_discount' })
  discount: number;

  @Column({ name: 'common_info_status' })
  status: string;

  @OneToMany(() => Work, (w) => w.commonInfo, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  public work: Work[];

  @OneToMany(() => Schedule, (sc) => sc.commonInfo, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  public schedule: Schedule[];

  @ManyToOne(() => Client, (c) => c.commonInformation, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([
    { name: 'common_info_client_uuid', referencedColumnName: 'uuid' },
  ])
  client: Client;

  @ManyToOne(() => Zipcode, (z) => z.commonInformation, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'common_info_zip_code', referencedColumnName: 'id' }])
  zipcode: Zipcode;

  @ManyToOne(() => House, (h) => h.commonInformation, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([
    { name: 'common_info_house_uuid', referencedColumnName: 'uuid' },
  ])
  house: House;
}
