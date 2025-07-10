import { Work } from 'src/work/work.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class TypeClean {
  @PrimaryGeneratedColumn({ name: 'type_clean_id' })
  id: number;
  @Column({ name: 'type_clean_name' })
  name: string;
  @Column({ name: 'type_clean_order' })
  order: number;
  @Column({ name: 'type_clean_status' })
  status: string;

  @OneToMany(() => Work, (w) => w.typeCleaning, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  public work: Work[];
}
