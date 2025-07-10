import { Time } from './time.entity';
import { BasicService } from 'src/basic/basic.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class TimeService extends BasicService<Time> {
  constructor(
    @InjectRepository(Time)
    private readonly timeRepository: Repository<Time>,
  ) {
    super(timeRepository);
  }

  async getWholeListTime(): Promise<Time[]> {
    const result = await this.timeRepository
      .createQueryBuilder('time')
      .orderBy('time.order', 'ASC')
      .where('time.status = :status', { status: 'active' })
      .getMany();
    return result;
  }
}
