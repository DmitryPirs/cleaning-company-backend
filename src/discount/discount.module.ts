import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discount } from './discount.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Discount])],
  controllers: [DiscountController],
  providers: [DiscountService],
  exports: [TypeOrmModule, DiscountService],
})
export class DiscountModule {}
