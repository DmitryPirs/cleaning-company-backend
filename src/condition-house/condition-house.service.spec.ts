import { Test, TestingModule } from '@nestjs/testing';
import { ConditionHouseService } from './condition-house.service';

describe('ConditionHouseService', () => {
  let service: ConditionHouseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConditionHouseService],
    }).compile();

    service = module.get<ConditionHouseService>(ConditionHouseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
