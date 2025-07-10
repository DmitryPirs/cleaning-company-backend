import { Module } from '@nestjs/common';
import { Schedule } from './schedule.entity';
import { ScheduleService } from './schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleController } from './schedule.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule])],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [TypeOrmModule, ScheduleService],
})
export class ScheduleModule {}
