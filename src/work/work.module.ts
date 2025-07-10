import { Module } from '@nestjs/common';
import { WorkController } from './work.controller';
import { WorkService } from './work.service';
import { UserService } from '../user/user.service';
import { HouseService } from '../house/house.service';
import { Work } from './work.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { HouseModule } from 'src/house/house.module';

@Module({
  imports: [TypeOrmModule.forFeature([Work]), UserModule, HouseModule],
  controllers: [WorkController],
  providers: [WorkService, UserService, HouseService],
  exports: [TypeOrmModule, WorkService, UserService, HouseService],
})
export class WorkModule {}
