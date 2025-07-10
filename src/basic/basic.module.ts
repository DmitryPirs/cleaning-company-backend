import { Module } from '@nestjs/common';
import { BasicController } from './basic.controller';
import { BasicService } from './basic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Basic } from './basic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Basic])],
  controllers: [BasicController],
  providers: [BasicService],
  exports: [TypeOrmModule]
})

export class BasicModule {}