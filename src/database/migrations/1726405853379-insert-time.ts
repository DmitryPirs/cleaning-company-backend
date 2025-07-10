import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertTime1726405853379 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO public.time${process.env.ENDTABLE} (time_id, time_name, time_order, time_status) VALUES
(1, '08:30 AM', 1, 'run'),
(2, '09:00 AM', 2, 'run'),
(3, '09:30 AM', 3, 'run'),
(4, '10:00 AM', 4, 'run'),
(5, '10:30 AM', 5, 'run'),
(6, '11:00 AM', 6, 'run'),
(7, '11:30 AM', 7, 'run'),
(8, '12:00 PM', 8, 'run'),
(9, '00:30 PM', 9, 'run'),
(10, '01:00 PM', 10, 'run'),
(11, '01:30 PM', 11, 'run'),
(12, '02:00 PM', 12, 'run'),
(13, '02:30 PM', 13, 'run'),
(14, '03:00 PM', 14, 'run'),
(15, '03:30 PM', 15, 'run'),
(16, '04:00 PM', 16, 'run'),
(17, '04:30 PM', 17, 'run'),
(18, '05:00 PM', 18, 'run'),
(19, '05:30 PM', 19, 'run'),
(20, '06:00 PM', 20, 'run'),
(21, '06:30 PM', 21, 'run'),
(22, '07:00 PM', 22, 'run')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM public.time${process.env.ENDTABLE} WHERE time_id BETWEEN 1 AND 22`,
    );
  }
}
