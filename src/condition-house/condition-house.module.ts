import { Module } from '@nestjs/common';
import { ConditionHouseService } from './condition-house.service';
import { ConditionHouse } from './condition-house.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ConditionHouse])],
  providers: [ConditionHouseService],
  exports: [TypeOrmModule, ConditionHouseService]
})
export class ConditionHouseModule {}