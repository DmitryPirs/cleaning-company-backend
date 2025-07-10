import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonInfo } from './common-info.entity';
import { Repository } from 'typeorm';
import { BasicService } from 'src/basic/basic.service';
import { CreateCommonInfoDTO } from './dto/common-info.dto';
import { WorkService } from 'src/work/work.service';
import { ScheduleService } from 'src/schedule/schedule.service';
import { Schedule } from 'src/schedule/schedule.entity';
import { Work } from 'src/work/work.entity';
import { UpdateWorkDTO } from 'src/work/dto/update-work.dto';
import { UpdateScheduleDTO } from 'src/schedule/dto/update-schedule.dto';

interface Interval {
  teamUuid: string;
  startTime: number;
  finishTime: number;
}

interface ListWorksSchedulesInterface {
  uuid: string;
  teamUuid: string;
  teamName: string;
  startTime: number;
  finishTime: number;
  status: string;
  squareFeet: number;
  clientUuid: string;
  clientName: string;
  clientPhone: string;
  houseUuid: string;
  housePropertyAddress: string;
  houseApartmentSuite: string;
  zipCode: number;
  zipCodeCity: string;
  zipCodeState: string;
  houseCondition: string;
  typeCleaning: string;
  interiorWindows: boolean;
  insideOven: boolean;
  wipeBaseboards: boolean;
  insideFridge: boolean;
  insideCabinets: boolean;
  bedrooms: number;
  bathrooms: number;
  excludeBedrooms: number;
  excludeBathrooms: number;
}

@Injectable()
export class CommonInfoService extends BasicService<CommonInfo> {
  constructor(
    @InjectRepository(CommonInfo)
    private readonly commonInfoRepository: Repository<CommonInfo>,
    private readonly workService: WorkService,
    private readonly scheduleService: ScheduleService,
  ) {
    super(commonInfoRepository);
  }

  async createNewCommonInfo(
    createCommonInfoDto: CreateCommonInfoDTO,
  ): Promise<CommonInfo> {
    return this.create(createCommonInfoDto);
  }

  async getOneByClientUuidByHouseUuidByZipCodeBySquareFeetByDiscount(
    clientUuid: string,
    houseUuid: string,
    zipCode: number,
    squareFeet: number,
    discount: number,
  ): Promise<CommonInfo> {
    return await this.commonInfoRepository
      .createQueryBuilder('commonInfo')
      .where('commonInfo.clientUuid = :clientUuid', { clientUuid })
      .andWhere('commonInfo.houseUuid = :houseUuid', { houseUuid })
      .andWhere('commonInfo.zipCode = :zipCode', { zipCode })
      .andWhere('commonInfo.squareFeet = :squareFeet', { squareFeet })
      .andWhere('commonInfo.discount = :discount', { discount })
      .getOne();
  }

  async getOneTeamScheduleIntervals(
    teamUuid: string,
    date: string,
    discount: number,
  ): Promise<any[]> {
    const scheduleJobSlots = []; // все занятые интевалы
    switch (discount) {
      case 1: // 1	"Every 2 Weeks = 10% discount (most popular)"
        try {
          const dayOfWeek = this.getWeekDay(date);
          const firstWeekNumber = this.getWeekNumber(date);
          let secondWeekNumber = 0;
          switch (firstWeekNumber) {
            case 1:
              secondWeekNumber = 3;
              break;
            case 2:
              secondWeekNumber = 4;
              break;
            case 3:
              secondWeekNumber = 1;
              break;
            case 4:
              secondWeekNumber = 2;
              break;
          }

          const allSchedules =
            await this.scheduleService.getSchedulesByDayOfWeekByTwoNumbersOfWeek(
              dayOfWeek,
              firstWeekNumber,
              secondWeekNumber,
            );

          allSchedules.forEach((element: Schedule) => {
            if (element.teamUuid === teamUuid) {
              scheduleJobSlots.push({
                startTime: element.startTime,
                finishTime: element.finishTime,
              });
            }
          });

          return this.mergeIntervals(scheduleJobSlots);
        } catch (error) {
          return [];
        }
        break;
      case 2: // 2	"Every 4 Weeks = 5% discount"
        try {
          const dayOfWeek = this.getWeekDay(date);
          const weekNumber = this.getWeekNumber(date);

          const allSchedules =
            await this.scheduleService.getSchedulesByDayOfWeekByNumberOfWeek(
              dayOfWeek,
              weekNumber,
            );

          allSchedules.forEach((element: Schedule) => {
            if (element.teamUuid === teamUuid) {
              scheduleJobSlots.push({
                startTime: element.startTime,
                finishTime: element.finishTime,
              });
            }
          });

          return this.mergeIntervals(scheduleJobSlots);
        } catch (error) {
          return [];
        }
        break;
      case 3: // 3	"Weekly = 15% discount"
        try {
          const dayOfWeek = this.getWeekDay(date);

          const allSchedules =
            await this.scheduleService.getSchedulesByDayOfWeekByFourNumbersOfWeekByTeamUuid(
              dayOfWeek,
            );
          allSchedules.forEach((element: Schedule) => {
            if (element.teamUuid === teamUuid) {
              scheduleJobSlots.push({
                startTime: element.startTime,
                finishTime: element.finishTime,
              });
            }
          });

          return this.mergeIntervals(scheduleJobSlots);
        } catch (error) {
          return [];
        }
        break;
      case 4: // 4	"One Time"
        try {
          const dayOfWeek = this.getWeekDay(date);
          const weekNumber = this.getWeekNumber(date);

          const allSchedules =
            await this.scheduleService.getSchedulesByDayOfWeekByNumberOfWeek(
              dayOfWeek,
              weekNumber,
            );

          allSchedules.forEach((element: Schedule) => {
            if (element.teamUuid === teamUuid) {
              scheduleJobSlots.push({
                startTime: element.startTime,
                finishTime: element.finishTime,
              });
            }
          });

          return this.mergeIntervals(scheduleJobSlots);
        } catch (error) {
          return [];
        }
        break;
    }
  }
  async getTeamJobIntervals(
    date: string,
    discount: number,
    duringCleaning: number,
  ): Promise<any[]> {
    const commonJobSlots = []; // все занятые интевалы
    switch (discount) {
      case 1: // 1	"Every 2 Weeks = 10% discount (most popular)"
        try {
          const dayOfWeek = this.getWeekDay(date);
          const weekNumber1 = this.getWeekNumber(date);
          let weekNumber2 = 0;
          switch (weekNumber1) {
            case 1:
              weekNumber2 = 3;
              break;
            case 2:
              weekNumber2 = 4;
              break;
            case 3:
              weekNumber2 = 1;
              break;
            case 4:
              weekNumber2 = 2;
              break;
          }

          const allSchedules =
            await this.scheduleService.getSchedulesByDayOfWeekByTwoNumbersOfWeek(
              dayOfWeek,
              weekNumber1,
              weekNumber2,
            );
          allSchedules.forEach((element: Schedule) => {
            commonJobSlots.push({
              teamUuid: element.teamUuid,
              startTime: element.startTime,
              finishTime: element.finishTime,
            });
          });
          const allWorksAfterOfEqualsDate =
            await this.workService.getActiveWorksAfterOrEqualsDateByDate(date);

          allWorksAfterOfEqualsDate.forEach((element: Work) => {
            if (
              dayOfWeek === this.getWeekDay(element.date) &&
              (weekNumber1 === this.getWeekNumber(element.date) ||
                weekNumber2 === this.getWeekNumber(element.date))
            ) {
              commonJobSlots.push({
                teamUuid: element.teamUuid,
                startTime: element.startTime,
                finishTime: element.finishTime,
              });
            }
          });

          const timeIntervalsMix = this.mergeIntervalsByTeam(commonJobSlots);

          const mergedByTeam = Object.keys(timeIntervalsMix).map((index) => ({
            teamUuid: timeIntervalsMix[index].teamUuid,
            jobIntervals: timeIntervalsMix[index].intervals,
            freeIntervals: this.findAvailableSlots(
              timeIntervalsMix[index].intervals,
              duringCleaning,
            ),
          }));

          return mergedByTeam;
        } catch (error) {
          return [];
        }
        break;
      case 2: // 2	"Every 4 Weeks = 5% discount"
        try {
          const dayOfWeek = this.getWeekDay(date);
          const weekNumber = this.getWeekNumber(date);

          const allSchedules =
            await this.scheduleService.getSchedulesByDayOfWeekByNumberOfWeek(
              dayOfWeek,
              weekNumber,
            );

          allSchedules.forEach((element: Schedule) => {
            commonJobSlots.push({
              teamUuid: element.teamUuid,
              startTime: element.startTime,
              finishTime: element.finishTime,
            });
          });

          const allWorksAfterOfEqualsDate =
            await this.workService.getActiveWorksAfterOrEqualsDateByDate(date);

          allWorksAfterOfEqualsDate.forEach((element: Work) => {
            if (dayOfWeek === this.getWeekDay(element.date)) {
              commonJobSlots.push({
                teamUuid: element.teamUuid,
                startTime: element.startTime,
                finishTime: element.finishTime,
              });
            }
          });

          const timeIntervalsMix = this.mergeIntervalsByTeam(commonJobSlots);

          const mergedByTeam = Object.keys(timeIntervalsMix).map((index) => ({
            teamUuid: timeIntervalsMix[index].teamUuid,
            jobIntervals: timeIntervalsMix[index].intervals,
            freeIntervals: this.findAvailableSlots(
              timeIntervalsMix[index].intervals,
              duringCleaning,
            ),
          }));

          return mergedByTeam;
        } catch (error) {
          return [];
        }
        break;
      case 3: // 3	"Weekly = 15% discount"
        try {
          const dayOfWeek = this.getWeekDay(date);

          const allSchedules =
            await this.scheduleService.getSchedulesByDayOfWeekByFourNumbersOfWeekByTeamUuid(
              dayOfWeek,
            );

          allSchedules.forEach((element: Schedule) => {
            commonJobSlots.push({
              teamUuid: element.teamUuid,
              startTime: element.startTime,
              finishTime: element.finishTime,
            });
          });

          const allWorksAfterOfEqualsDate =
            await this.workService.getActiveWorksAfterOrEqualsDateByDate(date);

          allWorksAfterOfEqualsDate.forEach((element: Work) => {
            if (dayOfWeek === this.getWeekDay(element.date)) {
              commonJobSlots.push({
                teamUuid: element.teamUuid,
                startTime: element.startTime,
                finishTime: element.finishTime,
              });
            }
          });

          const timeIntervalsMix = this.mergeIntervalsByTeam(commonJobSlots);

          const mergedByTeam = Object.keys(timeIntervalsMix).map((index) => ({
            teamUuid: timeIntervalsMix[index].teamUuid,
            jobIntervals: timeIntervalsMix[index].intervals,
            freeIntervals: this.findAvailableSlots(
              timeIntervalsMix[index].intervals,
              duringCleaning,
            ),
          }));

          return mergedByTeam;
        } catch (error) {
          return [];
        }
      case 4: // 4	"One Time"
        try {
          const dayOfWeek = this.getWeekDay(date);
          const weekNumber = this.getWeekNumber(date);

          const allSchedules =
            await this.scheduleService.getSchedulesByDayOfWeekByNumberOfWeek(
              dayOfWeek,
              weekNumber,
            );

          allSchedules.forEach((element: Schedule) => {
            commonJobSlots.push({
              teamUuid: element.teamUuid,
              startTime: element.startTime,
              finishTime: element.finishTime,
            });
          });

          const allWorksAfterOfEqualsDate =
            await this.workService.getActiveWorksAfterOrEqualsDateByDate(date);
          allWorksAfterOfEqualsDate.forEach((element: Work) => {
            if (
              dayOfWeek === this.getWeekDay(element.date) &&
              weekNumber === this.getWeekNumber(element.date)
            ) {
              commonJobSlots.push({
                teamUuid: element.teamUuid,
                startTime: element.startTime,
                finishTime: element.finishTime,
              });
            }
          });

          const timeIntervalsMix = this.mergeIntervalsByTeam(commonJobSlots);

          const mergedByTeam = Object.keys(timeIntervalsMix).map((index) => ({
            teamUuid: timeIntervalsMix[index].teamUuid,
            jobIntervals: timeIntervalsMix[index].intervals,
            freeIntervals: this.findAvailableSlots(
              timeIntervalsMix[index].intervals,
              duringCleaning,
            ),
          }));

          return mergedByTeam;
        } catch (error) {
          return [];
        }
    }
  }

  async getFreeIntervals(
    mergedByTeam: Array<{
      teamUuid: string;
      jobIntervals: Array<any>;
      freeIntervals: Array<any>;
    }>,
  ): Promise<Array<any>> {
    return [
      ...new Set(mergedByTeam.flatMap((item) => item.freeIntervals)),
    ].sort((a, b) => a - b);
  }

  async deleteWorkOrScheduleByUuid(uuid: string): Promise<boolean> {
    let schedule = null;
    let commonInfoUuid = '';
    const work = await this.workService.findOneByUuid(uuid);
    if (work === null) {
      schedule = await this.scheduleService.findOneByUuid(uuid);
    }
    if (work === null) {
      commonInfoUuid = schedule.commonInfoUuid;
    } else {
      commonInfoUuid = work.commonInfoUuid;
    }
    const updateWorkDto: UpdateWorkDTO = {
      status: 'cancel',
    };

    await this.workService.updateByCommonInfoInfo(
      commonInfoUuid,
      updateWorkDto,
    );

    const updateScheduleDto: UpdateScheduleDTO = {
      status: 'cancel',
    };

    await this.scheduleService.updateByCommonInfoInfo(
      commonInfoUuid,
      updateScheduleDto,
    );
    return true;
  }

  findAvailableTeamsForCleaning(
    teams: any[],
    startTime: number,
    duration: number,
  ): string[] {
    const endTime = startTime + duration - 1; // Вычисляем время окончания уборки
    return teams
      .filter((team) => {
        const freeIntervals = team.freeIntervals;
        return (
          freeIntervals.includes(startTime) && freeIntervals.includes(endTime)
        );
      })
      .map((team) => team.teamUuid);
  }

  findAvailableSlots(
    bookings: Array<{ startTime: number; finishTime: number }>,
    newCleaningDuration: number,
  ) {
    bookings.sort((a, b) => a.startTime - b.startTime);

    const availableSlots = [];
    let lastEnd = 0; // Начинаем с 1 (00:30)

    for (const booking of bookings) {
      const freeInterval = booking.startTime - lastEnd;
      if (freeInterval >= newCleaningDuration) {
        for (
          let start = lastEnd;
          start <= booking.startTime - newCleaningDuration;
          start++
        ) {
          availableSlots.push(start);
        }
      }
      lastEnd = Math.max(lastEnd, booking.finishTime);
    }

    const remainingTime = 21 - lastEnd;
    if (remainingTime >= newCleaningDuration) {
      for (let start = lastEnd; start <= 21 - newCleaningDuration; start++) {
        availableSlots.push(start);
      }
    }
    return availableSlots;
  }

  mergeIntervals1(
    intervals1: Array<{ startTime: number; finishTime: number }>,
    intervals2: Array<{ startTime: number; finishTime: number }>,
  ) {
    const allIntervals = [...intervals1, ...intervals2];

    allIntervals.sort((a, b) => a.startTime - b.startTime);

    const mergedIntervals = [];

    for (const interval of allIntervals) {
      if (
        mergedIntervals.length === 0 ||
        interval.startTime > mergedIntervals[mergedIntervals.length - 1].end + 1
      ) {
        mergedIntervals.push(interval);
      } else {
        mergedIntervals[mergedIntervals.length - 1].end = Math.max(
          mergedIntervals[mergedIntervals.length - 1].end,
          interval.finishTime,
        );
      }
    }
    return mergedIntervals;
  }

  mergeIntervalsGroupByTeams(
    intervals1: Array<{
      teamUuid: string;
      startTime: number;
      finishTime: number;
    }>,
    intervals2: Array<{
      teamUuid: string;
      startTime: number;
      finishTime: number;
    }>,
  ) {
    const allIntervals = [...intervals1, ...intervals2];

    allIntervals.sort((a, b) => a.startTime - b.startTime);

    const mergedIntervals = [];

    for (const interval of allIntervals) {
      if (
        mergedIntervals.length === 0 ||
        interval.startTime > mergedIntervals[mergedIntervals.length - 1].end + 1
      ) {
        mergedIntervals.push(interval);
      } else {
        mergedIntervals[mergedIntervals.length - 1].end = Math.max(
          mergedIntervals[mergedIntervals.length - 1].end,
          interval.finishTime,
        );
      }
    }
    return mergedIntervals;
  }

  mergeIntervalsByTeam(intervals: Interval[]): {
    teamUuid: string;
    intervals: Array<{ startTime: number; finishTime: number }>;
  }[] {
    const teamIntervalsMap: Record<
      string,
      Array<{ startTime: number; finishTime: number }>
    > = {};

    intervals.forEach((interval) => {
      if (!teamIntervalsMap[interval.teamUuid]) {
        teamIntervalsMap[interval.teamUuid] = [];
      }
      teamIntervalsMap[interval.teamUuid].push({
        startTime: interval.startTime,
        finishTime: interval.finishTime,
      });
    });

    const mergeIntervals = (
      intervals: Array<{ startTime: number; finishTime: number }>,
    ) => {
      if (intervals.length === 0) return [];

      intervals.sort((a, b) => a.startTime - b.startTime);
      const mergedIntervals = [intervals[0]];

      for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const lastMerged = mergedIntervals[mergedIntervals.length - 1];

        if (current.finishTime > lastMerged.finishTime + 1) {
          mergedIntervals.push(current);
        } else {
          lastMerged.finishTime = Math.max(
            lastMerged.finishTime,
            current.finishTime,
          );
        }
      }

      return mergedIntervals;
    };

    const mergedByTeam = Object.keys(teamIntervalsMap).map((teamUuid) => ({
      teamUuid,
      intervals: mergeIntervals(teamIntervalsMap[teamUuid]),
    }));

    return mergedByTeam;
  }

  mergeIntervals(intervals: Array<{ startTime: number; finishTime: number }>) {
    if (intervals.length === 0) return [];

    intervals.sort((a, b) => a.startTime - b.startTime);
    const mergedIntervals = [intervals[0]];

    for (let i = 1; i < intervals.length; i++) {
      const current = intervals[i];
      const lastMerged = mergedIntervals[mergedIntervals.length - 1];

      if (current.startTime > lastMerged.finishTime + 1) {
        mergedIntervals.push(current);
      } else {
        lastMerged.finishTime = Math.max(
          lastMerged.finishTime,
          current.finishTime,
        );
      }
    }

    return mergedIntervals;
  }

  async getAllActiveWorksAndSchedulesByDate(date: string): Promise<any[]> {
    try {
      const resultList: ListWorksSchedulesInterface[] = [];
      const works = await this.workService.getActiveWorksByDate(date);
      const dayOfWeek = this.getWeekDay(date);
      const numberOfWeek = this.getWeekNumber(date);
      const schedules =
        await this.scheduleService.getActiveSchedulesObjectByDayOfWeekByNumberOfWeek(
          dayOfWeek,
          numberOfWeek,
        );

      if (works.length === 0 && schedules.length === 0) {
        console.log('works.length === 0 && schedules.length === 0');
        return [];
      }

      if (works.length > 0) {
        works.forEach((element) => {
          const newWork: ListWorksSchedulesInterface = {
            uuid: element.uuid,
            teamUuid: element.teamUuid,
            teamName: element.team.name,
            startTime: element.startTime,
            finishTime: element.finishTime,
            status: element.status,
            squareFeet: element.commonInfo.squareFeet,
            clientUuid: element.commonInfo.clientUuid,
            clientName: element.commonInfo.client.name,
            clientPhone: element.commonInfo.client.phone,
            houseUuid: element.commonInfo.house.uuid,
            housePropertyAddress: element.commonInfo.house.propertyAddress,
            houseApartmentSuite: element.commonInfo.house.apartmentSuite,
            zipCode: element.commonInfo.zipcode.id,
            zipCodeCity: element.commonInfo.zipcode.city,
            zipCodeState: element.commonInfo.zipcode.state,
            houseCondition: element.conditionHouse.name,
            typeCleaning: element.typeCleaning.name,
            interiorWindows: element.interiorWindows,
            insideOven: element.insideOven,
            wipeBaseboards: element.wipeBaseboards,
            insideFridge: element.insideFridge,
            insideCabinets: element.insideCabinets,
            bedrooms: element.bedrooms,
            bathrooms: element.bathrooms,
            excludeBedrooms: element.excludeBedrooms,
            excludeBathrooms: element.excludeBathrooms,
          };
          resultList.push(newWork);
        });
      }
      if (schedules.length === 0) {
        return resultList.sort((a, b) => a.startTime - b.startTime);
      }

      if (schedules.length > 0) {
        schedules.forEach((sch) => {
          const exists = works.some(
            (item) =>
              item.commonInfo.houseUuid === sch.commonInfo.houseUuid &&
              item.commonInfo.zipCode === sch.commonInfo.zipCode &&
              item.startTime === sch.startTime,
          );
          if (exists === false) {
            const newWork: ListWorksSchedulesInterface = {
              uuid: sch.uuid,
              teamUuid: sch.teamUuid,
              teamName: sch.team.name,
              startTime: sch.startTime,
              finishTime: sch.finishTime,
              status: sch.status,
              squareFeet: sch.commonInfo.squareFeet,
              clientUuid: sch.commonInfo.clientUuid,
              clientName: sch.commonInfo.client.name,
              clientPhone: sch.commonInfo.client.phone,
              houseUuid: sch.commonInfo.house.uuid,
              housePropertyAddress: sch.commonInfo.house.propertyAddress,
              houseApartmentSuite: sch.commonInfo.house.apartmentSuite,
              zipCode: sch.commonInfo.zipcode.id,
              zipCodeCity: sch.commonInfo.zipcode.city,
              zipCodeState: sch.commonInfo.zipcode.state,
              houseCondition: 're-cleaning',
              typeCleaning: 'Standard cleaning',
              interiorWindows: false,
              insideOven: false,
              wipeBaseboards: false,
              insideFridge: false,
              insideCabinets: false,
              bedrooms: sch.bedrooms,
              bathrooms: sch.bathrooms,
              excludeBedrooms: sch.excludeBedrooms,
              excludeBathrooms: sch.excludeBathrooms,
            };
            resultList.push(newWork);
          }
        });
      }

      return resultList.sort((a, b) => a.startTime - b.startTime);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
