import { Controller, Get } from '@nestjs/common';
import { ConditionHouseService } from './condition-house.service';
import { ConditionHouse } from './condition-house.entity';

@Controller('condition-house')
export class ConditionHouseController {
  constructor(private readonly conditionHouseService: ConditionHouseService) {}

  @Get('/get-all')
  async getAllActiveAListHouseCondition(): Promise<ConditionHouse[]> {
    return this.conditionHouseService.getAllActiveListHouseCondition();
  }
}
