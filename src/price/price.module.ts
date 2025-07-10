import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './price.entity';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';

@Module({
  imports: [TypeOrmModule.forFeature([Price]), PriceModule],
  controllers: [PriceController],
  providers: [PriceService],
  exports: [TypeOrmModule, PriceService],
})
export class PriceModule {}
