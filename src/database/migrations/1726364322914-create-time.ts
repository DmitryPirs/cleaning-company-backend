import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTime1726364322914 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS public.time${process.env.ENDTABLE}
        (
            time_id integer NOT NULL,
            time_name character varying COLLATE pg_catalog."default",
            time_order integer,
            time_status character varying COLLATE pg_catalog."default",
            CONSTRAINT timeusj92dbbr38s_ncu34dbf7_pkey PRIMARY KEY (time_id)
        )
        
        TABLESPACE pg_default;
        
        ALTER TABLE IF EXISTS public.timeusj92dbbr38s_ncu34dbf7
            OWNER to postgres;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE IF EXISTS public.time${process.env.ENDTABLE}`,
    );
  }
}
