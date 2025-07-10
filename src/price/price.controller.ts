import { Controller, Get } from '@nestjs/common';
import { PriceService } from './price.service';
import { Price } from './price.entity';

@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('/get-all')
  async getAllPrice(): Promise<Price[]> {
    return await this.priceService.getAll();
  }
}
