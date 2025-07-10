import { Test, TestingModule } from '@nestjs/testing';
import { CommonInfoController } from './common-info.controller';

describe('CommonInfoController', () => {
  let controller: CommonInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommonInfoController],
    }).compile();

    controller = module.get<CommonInfoController>(CommonInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
