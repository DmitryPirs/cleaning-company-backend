import { Test, TestingModule } from '@nestjs/testing';
import { TypeCleanController } from './type-clean.controller';

describe('TypeCleanController', () => {
  let controller: TypeCleanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeCleanController],
    }).compile();

    controller = module.get<TypeCleanController>(TypeCleanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
