import { Test, TestingModule } from '@nestjs/testing';
import { TypeCleanService } from './type-clean.service';

describe('TypeCleanService', () => {
  let service: TypeCleanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeCleanService],
    }).compile();

    service = module.get<TypeCleanService>(TypeCleanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
