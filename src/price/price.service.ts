import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicService } from 'src/basic/basic.service';
import { Price } from './price.entity';

@Injectable()
export class PriceService extends BasicService<Price> {
  constructor(
    @InjectRepository(Price)
    private readonly PriceRepository: Repository<Price>,
  ) {
    super(PriceRepository);
  }

  async getAll(): Promise<Price[]> {
    return await this.PriceRepository.createQueryBuilder('price')
      .orderBy('price.minSquare', 'DESC')
      .getMany();
  }
}
