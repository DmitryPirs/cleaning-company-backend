import { Schedule } from 'src/schedule/schedule.entity';
import { Work } from 'src/work/work.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('uuid', { name: 'team_uuid' })
  uuid: string;
  @Column({ type: 'uuid', name: 'team_name' })
  name: string;
  @Column({ name: 'team_status' })
  status: string;

  @OneToMany(() => Work, (w) => w.team, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  public work: Work[];

  @OneToMany(() => Schedule, (s) => s.team, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  public schedule: Schedule[];
}
