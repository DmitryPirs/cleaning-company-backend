import { Module } from '@nestjs/common';
import { Time } from './time.entity';
import { TimeService } from './time.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeController } from './time.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Time])],
  controllers: [TimeController],
  providers: [TimeService],
  exports: [TypeOrmModule, TimeService],
})
export class TimeModule {}
