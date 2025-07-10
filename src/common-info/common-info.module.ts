import { Module } from '@nestjs/common';
import { CommonInfo } from './common-info.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonInfoService } from './common-info.service';
import { ClientService } from '../client/client.service';
import { CommonInfoController } from './common-info.controller';
import { ClientModule } from 'src/client/client.module';
import { HouseModule } from 'src/house/house.module';
import { HouseService } from 'src/house/house.service';
import { TeamModule } from 'src/team/team.module';
import { TeamService } from 'src/team/team.service';
import { WorkModule } from 'src/work/work.module';
import { WorkService } from 'src/work/work.service';
import { ScheduleModule } from 'src/schedule/schedule.module';
import { ScheduleService } from 'src/schedule/schedule.service';
import { TimeService } from 'src/time/time.service';
import { TimeModule } from 'src/time/time.module';
import { OrderModule } from 'src/order/order.module';
import { OrderService } from 'src/order/order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommonInfo]),
    ClientModule,
    HouseModule,
    TeamModule,
    WorkModule,
    OrderModule,
    ScheduleModule,
    TimeModule,
  ],
  providers: [
    CommonInfoService,
    ClientService,
    HouseService,
    TeamService,
    WorkService,
    ScheduleService,
    TimeService,
    OrderService,
  ],
  controllers: [CommonInfoController],
  exports: [TypeOrmModule, CommonInfoService],
})
export class CommonInfoModule {}
