import { Injectable } from '@nestjs/common';
import { BasicService } from 'src/basic/basic.service';
import { Work } from './work.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkDTO } from './dto/create-work.dto';

@Injectable()
export class WorkService extends BasicService<Work> {
  constructor(
    @InjectRepository(Work)
    private readonly workRepository: Repository<Work>,
  ) {
    super(workRepository);
  }

  async createNewWork(createWorkDto: CreateWorkDTO): Promise<any> {
    return this.create(createWorkDto);
  }

  async getActiveWorksByDate(date: string): Promise<Work[]> {
    return await this.workRepository
      .createQueryBuilder('work')
      .leftJoinAndSelect('work.typeCleaning', 'typeClean')
      .leftJoinAndSelect('work.conditionHouse', 'conditionHouse')
      .leftJoinAndSelect('work.commonInfo', 'commonInfo')
      .leftJoinAndSelect('work.team', 'team')
      .leftJoinAndSelect('commonInfo.client', 'client')
      .leftJoinAndSelect('commonInfo.house', 'house')
      .leftJoinAndSelect('commonInfo.zipcode', 'zipcode')
      .where('work.date = :date', { date })
      .andWhere('work.status = :status', { status: 'active' })
      .orderBy('work.startTime', 'ASC')
      .getMany();
  }

  async getCountHoursActiveWorksByTeamUuid(
    teamUuid: string,
  ): Promise<{ total: string | null }> {
    return await this.workRepository
      .createQueryBuilder('work')
      .where('work.teamUuid = :teamUuid', { teamUuid })
      .andWhere('work.status = :status', { status: 'active' })
      .select('SUM(work.finishTime)-SUM(work.startTime)', 'total')
      .getRawOne();
  }

  async getWorkIntervalsByOrderUuid(orderUuid: string): Promise<any> {
    return await this.workRepository
      .createQueryBuilder('work')
      .leftJoinAndSelect('work.commonInfo', 'commonInfo')
      .where('work.orderUuid = :orderUuid', { orderUuid })
      .andWhere('work.status = :status', { status: 'notpaid' })
      .orderBy('work.startTime', 'ASC')
      .select([
        'work.teamUuid',
        'work.typeClean',
        'work.houseCondition',
        'work.date',
        'work.startTime',
        'work.finishTime',
        'work.interiorWindows',
        'work.insideOven',
        'work.wipeBaseboards',
        'work.insideFridge',
        'work.insideCabinets',
        'work.pets',
        'work.price',
        'work.bedrooms',
        'work.bathrooms',
        'work.orderUuid',
        'commonInfo.discount',
      ])
      .getOne();
  }

  async updateByCommonInfoInfo(
    commonInfoUuid: string,
    dto: Partial<Work>,
  ): Promise<void> {
    await this.workRepository.update({ commonInfoUuid }, dto);
  }

  async updateByOrderUuid(orderUuid: string, dto: Partial<Work>): Promise<any> {
    return await this.workRepository.update({ orderUuid }, dto);
  }

  async getListWorkByDate(date: string): Promise<Work[]> {
    return await this.workRepository
      .createQueryBuilder('work')
      .where('work.date = :date', { date })
      .orderBy('work.startTime', 'ASC')
      .getMany();
  }

  async getListActiveWorkByDateByTeamUuid(
    date: string,
    teamUuid: string,
  ): Promise<Work[]> {
    return await this.workRepository
      .createQueryBuilder('work')
      .where('work.date = :date', { date })
      .andWhere('work.teamUuid = :teamUuid', { teamUuid })
      .andWhere('work.status = :status', { status: 'active' })
      .orderBy('work.startTime', 'ASC')
      .getMany();
  }

  async getWorksAfterOrEqualsDateByDateByTeamUuid(
    date: string,
    teamUuid: string,
  ): Promise<Work[]> {
    return await this.workRepository
      .createQueryBuilder('work')
      .where('work.date >= :date', { date })
      .andWhere('work.teamUuid = :teamUuid', { teamUuid })
      .getMany();
  }

  async getActiveWorksAfterOrEqualsDateByDate(date: string): Promise<Work[]> {
    return await this.workRepository
      .createQueryBuilder('work')
      .where('work.date >= :date', { date })
      .andWhere('work.status = :status', { status: 'active' })
      .getMany();
  }

  async getActiveWorksInDateByDateByTeamUuid(
    date: string,
    teamUuid: string,
  ): Promise<Work[]> {
    return await this.workRepository
      .createQueryBuilder('work')
      .where('work.date = :date', { date })
      .where('work.teamUuid = :teamUuid', { teamUuid })
      .andWhere('work.status = :status', { status: 'active' })
      .getMany();
  }

  async getActiveWorkIntervalsByDate(
    date: string,
    teamUuid: string,
  ): Promise<any[]> {
    return await this.workRepository
      .createQueryBuilder('work')
      .where('work.date = :date', { date })
      .andWhere('work.teamUuid = :teamUuid', { teamUuid })
      .andWhere('work.status = :status', { status: 'active' })
      .select(['work.startTime', 'work.finishTime'])
      .getMany();
  }

  async getWorksEqualsDateByDateByTeamUuid(
    date: string,
    teamUuid: string,
  ): Promise<Work[]> {
    return await this.workRepository
      .createQueryBuilder('work')
      .where('work.date = :date', { date })
      .andWhere('work.teamUuid = :teamUuid', { teamUuid })
      .getMany();
  }

  async worksTest(word: string) {
    return `work ${word}`;
  }
}
