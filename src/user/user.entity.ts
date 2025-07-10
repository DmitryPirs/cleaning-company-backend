import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import * as bcrypt from 'bcrypt'; //npm i --save-dev @types/bcrypt

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'user_uuid' })
  uuid: string;

  @Column({ name: 'user_username' })
  userName: string;

  @Column({ name: 'user_phone' })
  phone: string;

  @Column({ name: 'user_email' })
  email: string;

  @Column({ name: 'user_email_confirm' })
  emailConfirm: boolean;

  @Column({ name: 'user_data' })
  data: string;

  @Column({ name: 'user_status' })
  status: string;

  @Column({ name: 'user_role' })
  role: string;

  @Column({ name: 'user_password' })
  password: string;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
