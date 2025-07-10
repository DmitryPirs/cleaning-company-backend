import { Test, TestingModule } from '@nestjs/testing';
import { CommonInfoService } from './common-info.service';

describe('CommonInfoService', () => {
  let service: CommonInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonInfoService],
    }).compile();

    service = module.get<CommonInfoService>(CommonInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
