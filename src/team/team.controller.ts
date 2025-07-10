import { Controller, Get, UseGuards } from '@nestjs/common';
import { Team } from './team.entity';
import { TeamService } from './team.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('/get-all')
  getTime(): Promise<Team[]> {
    return this.teamService.findAllByStatus('active');
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get-all-admin')
  async getTimeForAdmin(): Promise<Team[]> {
    console.log('team / get-all-admin');
    return await this.teamService.findAllByStatus('active');
  }
}
