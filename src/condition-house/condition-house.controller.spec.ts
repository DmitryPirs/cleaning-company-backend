import { Test, TestingModule } from '@nestjs/testing';
import { ConditionHouseController } from './condition-house.controller';

describe('ConditionHouseController', () => {
  let controller: ConditionHouseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConditionHouseController],
    }).compile();

    controller = module.get<ConditionHouseController>(ConditionHouseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
