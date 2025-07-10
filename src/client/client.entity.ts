import { CommonInfo } from 'src/common-info/common-info.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Client {
  @PrimaryGeneratedColumn('uuid', { name: 'client_uuid' })
  uuid: string;

  @Column({ name: 'client_name' })
  name: string;

  @Column({ name: 'client_phone' })
  phone: string;

  @Column({ name: 'client_email' })
  email: string;

  @Column({ name: 'client_email_confirm' })
  emailConfirm: boolean;

  @Column({ name: 'client_data' })
  data: string;

  @Column({ name: 'client_status' })
  status: string;

  @Column({ name: 'client_password' })
  password: string;

  @OneToMany(() => CommonInfo, (ci) => ci.client, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  public commonInformation: CommonInfo[];
}
