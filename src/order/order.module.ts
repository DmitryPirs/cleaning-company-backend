import { Module } from '@nestjs/common';
import { Order } from './order.entity';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [TypeOrmModule, OrderService],
})
export class OrderModule {}
