import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { WorkService } from './work.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/get-all-by-date-admin/:date')
  async getAllAdmin(@Param('date') date: string): Promise<any[]> {
    await this.workService.getActiveWorksByDate(date);
    return [];
  }
}
