import { Injectable } from '@nestjs/common';
import { Discount } from './discount.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicService } from 'src/basic/basic.service';

@Injectable()
export class DiscountService extends BasicService<Discount> {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepository: Repository<Discount>,
  ) {
    super(discountRepository);
  }

  async getAllActiveDiscount(): Promise<Discount[]> {
    return await this.discountRepository
      .createQueryBuilder('discount')
      .orderBy('discount.order', 'ASC')
      .where('discount.status = :status', { status: 'active' })
      .getMany();
  }
}
