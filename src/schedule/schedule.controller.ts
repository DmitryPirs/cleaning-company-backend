import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Schedule } from './schedule.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/get-all-by-date-admin/:date')
  async getAllAdmin(@Param('date') date: string): Promise<Schedule[]> {
    return await this.scheduleService.getActiveScheduleByDate(date);
  }
}
