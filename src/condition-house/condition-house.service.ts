import { BasicService } from 'src/basic/basic.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConditionHouse } from './condition-house.entity';

export class ConditionHouseService extends BasicService<ConditionHouse> {
  constructor(
    @InjectRepository(ConditionHouse)
    private readonly conditionHouseRepository: Repository<ConditionHouse>,
  ) {
    super(conditionHouseRepository);
  }

  async getAllActiveListHouseCondition(): Promise<ConditionHouse[]> {
    return await this.conditionHouseRepository
      .createQueryBuilder('conditionHouse')
      .orderBy('conditionHouse.order', 'ASC')
      .where('conditionHouse.status = :status', { status: 'active' })
      .getMany();
  }
}
