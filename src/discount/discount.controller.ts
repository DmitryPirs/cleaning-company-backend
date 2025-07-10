import { Controller, Get } from '@nestjs/common';
import { Discount } from './discount.entity';
import { DiscountService } from './discount.service';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get('/get-all')
  getAllActiveDiscount(): Promise<Discount[]> {
    return this.discountService.getAllActiveDiscount();
  }
}
