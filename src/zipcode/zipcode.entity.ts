import { CommonInfo } from 'src/common-info/common-info.entity';
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

@Entity()
export class Zipcode {
  @PrimaryColumn({ name: 'zipcode_id' })
  id: number;

  @Column({ name: 'zipcode_city' })
  city: string;

  @Column({ name: 'zipcode_state_code' })
  stateCode: string;

  @Column({ name: 'zipcode_state' })
  state: string;

  @Column({ name: 'zipcode_status' })
  status: string;

  @OneToMany(() => CommonInfo, (ci) => ci.zipcode, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  public commonInformation: CommonInfo[];
}
