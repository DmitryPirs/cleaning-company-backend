import { CommonInfo } from 'src/common-info/common-info.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class House {
  @PrimaryGeneratedColumn('uuid', { name: 'house_uuid' })
  uuid: string;

  @Column({ name: 'house_property_address' })
  propertyAddress: string;

  @Column({ name: 'house_apartment_suite' })
  apartmentSuite: string;

  @Column({ name: 'house_status' })
  status: string;

  @OneToMany(() => CommonInfo, (ci) => ci.house, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  public commonInformation: CommonInfo[];
}
