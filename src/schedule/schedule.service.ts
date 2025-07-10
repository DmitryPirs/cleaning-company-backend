import { Injectable } from '@nestjs/common';
import { BasicService } from 'src/basic/basic.service';
import { Schedule } from './schedule.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CreateScheduleDTO } from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService extends BasicService<Schedule> {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {
    super(scheduleRepository);
  }

  async createNewSchedule(createScheduleDto: CreateScheduleDTO): Promise<any> {
    return this.create(createScheduleDto);
  }

  async getSchedulesByDayOfWeekByNumberOfWeekByTeamUuid(
    dayOfWeek: number,
    numberOfWeek: number,
    teamUuid: string,
  ): Promise<Schedule[]> {
    return await this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.dayOfWeek = :dayOfWeek', { dayOfWeek })
      .andWhere('schedule.numberOfWeek = :numberOfWeek', { numberOfWeek })
      .andWhere('schedule.teamUuid = :teamUuid', { teamUuid })
      .andWhere('schedule.status = :status', { status: 'active' })
      .getMany();
  }

  async updateByCommonInfoInfo(
    commonInfoUuid: string,
    dto: Partial<Schedule>,
  ): Promise<void> {
    await this.scheduleRepository.update({ commonInfoUuid }, dto);
    console.log('sch update ok');
  }

  async updateByOrderUuid(
    orderUuid: string,
    dto: Partial<Schedule>,
  ): Promise<void> {
    await this.scheduleRepository.update({ orderUuid }, dto);
    console.log('sch update ok');
  }

  async getSchedulesByDayOfWeekByNumberOfWeek(
    dayOfWeek: number,
    numberOfWeek: number,
  ): Promise<Schedule[]> {
    return await this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.dayOfWeek = :dayOfWeek', { dayOfWeek })
      .andWhere('schedule.numberOfWeek = :numberOfWeek', { numberOfWeek })
      .andWhere('schedule.status = :status', { status: 'active' })
      .getMany();
  }

  async getScheduleIntervalsByOrderUuid(
    orderUuid: string,
  ): Promise<Schedule[]> {
    try {
      await this.scheduleRepository
        .createQueryBuilder('schedule')
        .where('schedule.orderUuid = :orderUuid', { orderUuid })
        .andWhere('schedule.status = :status', { status: 'notpaid' })
        .orderBy('schedule.startTime', 'ASC')
        .select([
          'schedule.startTime',
          'schedule.finishTime',
          'schedule.teamUuid',
          'schedule.dayOfWeek',
          'schedule.numberOfWeek',
        ])
        .getMany();
    } catch (error) {
      console.log(error);
    }
    return await this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.orderUuid = :orderUuid', { orderUuid })
      .andWhere('schedule.status = :status', { status: 'notpaid' })
      .orderBy('schedule.startTime', 'ASC')
      .select([
        'schedule.startTime',
        'schedule.finishTime',
        'schedule.teamUuid',
        'schedule.dayOfWeek',
        'schedule.numberOfWeek',
      ])
      .getMany();
  }

  async getSchedulesByDateByTeamUuid(
    date: string,
    teamUuid: string,
    discount: number,
  ): Promise<Schedule[]> {
    const dayOfWeek = this.getWeekDay(date);
    const numberOfWeek1 = this.getWeekNumber(date);
    let numberOfWeek2 = 0;
    let numberOfWeek3 = 0;
    let numberOfWeek4 = 0;

    switch (numberOfWeek1) {
      case 1:
        numberOfWeek2 = 2;
        numberOfWeek3 = 3;
        numberOfWeek4 = 4;
        break;
      case 2:
        numberOfWeek2 = 3;
        numberOfWeek3 = 4;
        numberOfWeek4 = 1;
        break;
      case 3:
        numberOfWeek2 = 4;
        numberOfWeek3 = 1;
        numberOfWeek4 = 2;
        break;
      case 4:
        numberOfWeek2 = 1;
        numberOfWeek3 = 2;
        numberOfWeek4 = 3;
        break;
    }

    // 4	"One Time"	          0
    switch (discount) {
      case 1:
        // 1	"Every 2 Weeks = 10% 	2
        return await this.scheduleRepository
          .createQueryBuilder('schedule')
          .where('schedule.dayOfWeek = :dayOfWeek', { dayOfWeek })
          .andWhere('schedule.status = :status', { status: 'active' })
          .andWhere('schedule.teamUuid = :teamUuid', { teamUuid })
          .andWhere(
            new Brackets((qb) => {
              qb.orWhere('schedule.numberOfWeek = :numberOfWeek1', {
                numberOfWeek1,
              }).orWhere('schedule.numberOfWeek = :numberOfWeek3', {
                numberOfWeek3,
              });
            }),
          )
          .getMany();
      case 3: // 3	"Weekly = 15%         4
        return await this.scheduleRepository
          .createQueryBuilder('schedule')
          .where('schedule.dayOfWeek = :dayOfWeek', { dayOfWeek })
          .andWhere('schedule.status = :status', { status: 'active' })
          .andWhere('schedule.teamUuid = :teamUuid', { teamUuid })
          .andWhere(
            new Brackets((qb) => {
              qb.orWhere('schedule.numberOfWeek = :numberOfWeek1', {
                numberOfWeek1,
              })
                .orWhere('schedule.numberOfWeek = :numberOfWeek2', {
                  numberOfWeek2,
                })
                .orWhere('schedule.numberOfWeek = :numberOfWeek3', {
                  numberOfWeek3,
                })
                .orWhere('schedule.numberOfWeek = :numberOfWeek4', {
                  numberOfWeek4,
                });
            }),
          )
          .getMany();
      case 2:
      case 4:
        // 2	"Every 4 Weeks = 5% 	1
        return await this.scheduleRepository
          .createQueryBuilder('schedule')
          .where('schedule.dayOfWeek = :dayOfWeek', { dayOfWeek })
          .andWhere('schedule.status = :status', { status: 'active' })
          .andWhere('schedule.teamUuid = :teamUuid', { teamUuid })
          .andWhere(
            new Brackets((qb) => {
              qb.orWhere('schedule.numberOfWeek = :numberOfWeek1', {
                numberOfWeek1,
              });
            }),
          )
          .getMany();
      default:
        break;
    }
  }

  async getSchedulesByDayOfWeekByTwoNumbersOfWeek(
    dayOfWeek: number,
    numberOfWeek1: number,
    numberOfWeek2: number,
  ): Promise<Schedule[]> {
    return await this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.dayOfWeek = :dayOfWeek', { dayOfWeek })
      .andWhere('schedule.status = :status', { status: 'active' })
      .andWhere(
        new Brackets((qb) => {
          qb.orWhere('schedule.numberOfWeek = :numberOfWeek1', {
            numberOfWeek1,
          }).orWhere('schedule.numberOfWeek = :numberOfWeek1', {
            numberOfWeek2,
          });
        }),
      )
      .getMany();
  }

  async getSchedulesByDayOfWeekByFourNumbersOfWeekByTeamUuid(
    dayOfWeek: number,
  ): Promise<Schedule[]> {
    return await this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.dayOfWeek = :dayOfWeek', { dayOfWeek })
      .andWhere('schedule.status = :status', { status: 'active' })
      // .andWhere('schedule.numberOfWeek = :numberOfWeek', { numberOfWeek })
      .andWhere(
        new Brackets((qb) => {
          qb.orWhere('schedule.numberOfWeek = :numberOfWeek', {
            numberOfWeek: 1,
          })
            .orWhere('schedule.numberOfWeek = :numberOfWeek', {
              numberOfWeek: 2,
            })
            .orWhere('schedule.numberOfWeek = :numberOfWeek', {
              numberOfWeek: 3,
            })
            .orWhere('schedule.numberOfWeek = :numberOfWeek', {
              numberOfWeek: 4,
            });
        }),
      )
      .getMany();
  }

  async getActiveSchedulesObjectByDayOfWeekByNumberOfWeek(
    dayOfWeek: number,
    numberOfWeek: number,
  ): Promise<Schedule[]> {
    return await this.scheduleRepository
      .createQueryBuilder('schedule')
      .leftJoinAndSelect('schedule.commonInfo', 'commonInfo')
      .leftJoinAndSelect('commonInfo.client', 'client')
      .leftJoinAndSelect('commonInfo.house', 'house')
      .leftJoinAndSelect('commonInfo.zipcode', 'zipcode')
      .leftJoinAndSelect('schedule.team', 'team')
      .where('schedule.dayOfWeek = :dayOfWeek', { dayOfWeek })
      .andWhere('schedule.numberOfWeek = :numberOfWeek', { numberOfWeek })
      .andWhere('schedule.status = :status', { status: 'active' })
      .orderBy('schedule.startTime', 'ASC')
      .getMany();
  }

  async getActiveScheduleByDate(date: string): Promise<Schedule[]> {
    const dayOfWeek = this.getWeekDay(date);
    const numberOfWeek = this.getWeekNumber(date);

    return await this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.dayOfWeek = :dayOfWeek', { dayOfWeek })
      .where('schedule.numberOfWeek = :numberOfWeek', { numberOfWeek })
      .andWhere('schedule.status = :status', { status: 'active' })
      .orderBy('schedule.startTime', 'ASC')
      .getMany();
  }

  async getCountHoursActiveSchedulesByTeamUuid(
    teamUuid: string,
  ): Promise<{ total: string | null }> {
    try {
      await this.scheduleRepository
        .createQueryBuilder('schedule')
        .where('schedule.teamUuid = :teamUuid', { teamUuid })
        .andWhere('schedule.status = :status', { status: 'active' })
        .select('SUM(schedule.finishTime)-SUM(schedule.startTime)', 'total')
        .getRawOne();
    } catch (error) {
      console.log(error);
    }
    return await this.scheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.teamUuid = :teamUuid', { teamUuid })
      .select('SUM(schedule.finishTime)-SUM(schedule.startTime)', 'total')
      .getRawOne();
  }
}
