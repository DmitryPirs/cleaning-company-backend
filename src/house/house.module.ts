import { Module } from '@nestjs/common';
import { HouseController } from './house.controller';
import { House } from './house.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HouseService } from './house.service';

@Module({
  imports: [TypeOrmModule.forFeature([House])],
  providers: [HouseService],
  controllers: [HouseController],
  exports: [TypeOrmModule, HouseService],
})
export class HouseModule {}
