import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicService } from 'src/basic/basic.service';
import { Team } from './team.entity';

@Injectable()
export class TeamService extends BasicService<Team> {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {
    super(teamRepository);
  }

  async getOneTeamByName(name: string): Promise<Team> {
    return await this.teamRepository
      .createQueryBuilder('team')
      .where('team.name = :name', { name })
      .getOne();
  }

  async getAllActiveSortByAlphabet(): Promise<Team[]> {
    return await this.teamRepository
      .createQueryBuilder('team')
      .orderBy('team.name', 'ASC')
      .where('team.status = :status', { status: 'active' })
      .getMany();
  }

  async getAllUuidActiveTeam(): Promise<Team[]> {
    return await this.teamRepository
      .createQueryBuilder('team')
      .orderBy('team.name', 'ASC')
      .where('team.status = :status', { status: 'active' })
      .select('team.uuid')
      .getMany();
  }

  async getAllRunForAdmin(): Promise<Team> {
    return await this.teamRepository
      .createQueryBuilder('team')
      .orderBy('team.name', 'ASC')
      .where('team.status = :status', { status: 'active' })
      .getOne();
  }
}
