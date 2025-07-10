import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Zipcode } from './zipcode.entity';
import { ZipcodeController } from './zipcode.controller';
import { ZipcodeService } from './zipcode.service';

@Module({
  imports: [TypeOrmModule.forFeature([Zipcode]), ZipcodeModule],
  controllers: [ZipcodeController],
  providers: [ZipcodeService],
  exports: [TypeOrmModule, ZipcodeService],
})
export class ZipcodeModule {}
