import { Test, TestingModule } from '@nestjs/testing';
import { ZipcodeController } from './zipcode.controller';

describe('ZipcodeController', () => {
  let controller: ZipcodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ZipcodeController],
    }).compile();

    controller = module.get<ZipcodeController>(ZipcodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
