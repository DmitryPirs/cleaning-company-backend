import { Test, TestingModule } from '@nestjs/testing';
import { ZipcodeService } from './zipcode.service';

describe('ZipcodeService', () => {
  let service: ZipcodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ZipcodeService],
    }).compile();

    service = module.get<ZipcodeService>(ZipcodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
