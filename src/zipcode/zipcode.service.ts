import { Injectable } from '@nestjs/common';
import { Zipcode } from './zipcode.entity';
import { BasicService } from 'src/basic/basic.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ZipcodeService extends BasicService<Zipcode> {
  constructor(
    @InjectRepository(Zipcode)
    private readonly zipcodeRepository: Repository<Zipcode>,
  ) {
    super(zipcodeRepository);
  }

  async getAll(): Promise<Zipcode[]> {
    return await this.zipcodeRepository
      .createQueryBuilder('zipcode')
      .orderBy('zipcode.id', 'ASC')
      .where('zipcode.status = :status', { status: 'active' })
      .getMany();
  }
}
