import { Controller, Get } from '@nestjs/common';
import { TimeService } from './time.service';
import { Time } from './time.entity';

@Controller('time')
export class TimeController {
  constructor(private readonly timeService: TimeService) {}

  @Get('/get-all')
  getTime(): Promise<Time[]> {
    return this.timeService.getWholeListTime();
  }
}
