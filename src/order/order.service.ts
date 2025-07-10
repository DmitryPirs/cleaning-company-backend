import { Injectable } from '@nestjs/common';
import { BasicService } from 'src/basic/basic.service';
import { Order } from './order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from './dto/create-order.dto';

@Injectable()
export class OrderService extends BasicService<Order> {
  constructor(
    @InjectRepository(Order)
    private readonly scheduleRepository: Repository<Order>,
  ) {
    super(scheduleRepository);
  }

  async createNewOrder(createOrderDto: CreateOrderDTO): Promise<any> {
    return this.create(createOrderDto);
  }
}
