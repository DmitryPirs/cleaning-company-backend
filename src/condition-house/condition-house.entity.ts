import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Work } from 'src/work/work.entity';

@Entity()
export class ConditionHouse {
  @PrimaryGeneratedColumn({ name: 'condition_house_id' })
  id: number;

  @Column({ name: 'condition_house_name' })
  name: string;

  @Column({ name: 'condition_house_order' })
  order: number;

  @Column({ name: 'condition_house_status' })
  status: string;

  @OneToMany(() => Work, (w) => w.conditionHouse, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  public work: Work[];
}
