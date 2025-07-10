import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommonInfoService } from './common-info.service';
import { CommonInfoFromClientInterface } from './interface/common-info-from-client.interface';
import { ClientService } from 'src/client/client.service';
import { HouseService } from 'src/house/house.service';
import { CreateClientDTO } from 'src/client/dto/create-client.dto';
import { CreateHouseDTO } from 'src/house/dto/create-house.dto';
import { CreateCommonInfoDTO } from './dto/common-info.dto';
import { CreateWorkDTO } from 'src/work/dto/create-work.dto';
import { TeamService } from 'src/team/team.service';
import { WorkService } from 'src/work/work.service';
import { CreateScheduleDTO } from 'src/schedule/dto/create-schedule.dto';
import { ScheduleService } from 'src/schedule/schedule.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TimeService } from 'src/time/time.service';
import { OrderService } from 'src/order/order.service';
import { CreateOrderDTO } from 'src/order/dto/create-order.dto';
import { OrderCardDataInterface } from './interface/order-card-data.interface';
import { UpdateWorkDTO } from 'src/work/dto/update-work.dto';
import { UpdateScheduleDTO } from 'src/schedule/dto/update-schedule.dto';

const TelegramBot = require('node-telegram-bot-api');
@Controller('common-info')
export class CommonInfoController {
  constructor(
    private readonly commonInfoService: CommonInfoService,
    private readonly clientService: ClientService,
    private readonly houseService: HouseService,
    private readonly teamService: TeamService,
    private readonly workService: WorkService,
    private readonly timeService: TimeService,
    private readonly scheduleService: ScheduleService,
    private readonly orderService: OrderService,
  ) {}

  @Post('/check-date')
  async checkByDate(
    @Body() data: { date: string; duringCleaning: number; discount: number },
  ): Promise<any[] | boolean> {
    const teams = await this.teamService.getAllUuidActiveTeam();
    const workIntervals = await this.commonInfoService.getTeamJobIntervals(
      data.date,
      data.discount,
      data.duringCleaning,
    );
    if (workIntervals.length === 0 || teams.length > workIntervals.length) {
      const wholeListTime = await this.timeService.getWholeListTime();
      const wholeListTimeFlat = wholeListTime.flatMap((item) => item.id); // берем только id времени
      return wholeListTimeFlat.slice(
        0,
        wholeListTimeFlat.length - data.duringCleaning + 1,
      );
    }
    const freeIntervals =
      await this.commonInfoService.getFreeIntervals(workIntervals);
    return freeIntervals;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:uuid')
  async deleteWorksAndSchedulesByUuid(
    @Param('uuid') uuid: string,
  ): Promise<boolean> {
    return this.commonInfoService.deleteWorkOrScheduleByUuid(uuid);
  }
  @UseGuards(JwtAuthGuard)
  @Get('/get-works-shedules-by-date-admin/:date')
  async getWorksShedulesByDate(@Param('date') date: string): Promise<any[]> {
    return await this.commonInfoService.getAllActiveWorksAndSchedulesByDate(
      date,
    );
  }

  @Post('/pay')
  async payOrder(@Body() data: OrderCardDataInterface): Promise<boolean> {
    const bot = new TelegramBot(process.env.BOT_TOKEN);

    if (
      this.commonInfoService.cleanString(data.cardNumber) !==
        process.env.TEST_CARD_NUMBER ||
      data.expiryDate !== process.env.TEST_CARD_EXPIRY_DATE ||
      data.cvcCode !== process.env.TEST_CARD_CVC_CODE
    ) {
      await bot.sendMessage(
        process.env.OWNER_TELEGRAM_ID,
        `Bad entered: ${data.cardNumber}, ${data.expiryDate}, ${data.cvcCode}`,
      );
      return false;
    } else {
      try {
        const workData = await this.workService.getWorkIntervalsByOrderUuid(
          data.orderUuid,
        );
        if (workData === null) {
          return false;
        }
        const listActiveWorks =
          await this.workService.getListActiveWorkByDateByTeamUuid(
            workData.date,
            workData.teamUuid,
          );
        for (const workInterval of listActiveWorks) {
          if (
            (workData.startTime > workInterval.startTime &&
              workData.startTime < workInterval.finishTime) ||
            (workData.finishTime > workInterval.startTime &&
              workData.finishTime < workInterval.finishTime)
          ) {
            return false;
          }
        }

        const scheduleData =
          await this.scheduleService.getScheduleIntervalsByOrderUuid(
            data.orderUuid,
          );
        if (scheduleData !== null) {
          for (const scheduleDataInterval of scheduleData) {
            if (
              (workData.startTime > scheduleDataInterval.startTime &&
                workData.startTime < scheduleDataInterval.finishTime) ||
              (workData.finishTime > scheduleDataInterval.startTime &&
                workData.finishTime < scheduleDataInterval.finishTime)
            ) {
              return false;
            }
          }
          const listActiveSchedule =
            await this.scheduleService.getSchedulesByDateByTeamUuid(
              workData.date,
              workData.teamUuid,
              workData.commonInfo.discount,
            );
          if (listActiveSchedule.length > 0) {
            const listActiveScheduleStartFinishTime = listActiveSchedule.map(
              (item) => ({
                startTime: item.startTime,
                finishTime: item.finishTime,
              }),
            );
            for (const listActiveScheduleStartFinishTimeInterval of listActiveScheduleStartFinishTime) {
              for (const scheduleDataInterval of listActiveSchedule) {
                if (
                  (listActiveScheduleStartFinishTimeInterval.startTime >
                    scheduleDataInterval.startTime &&
                    listActiveScheduleStartFinishTimeInterval.startTime <
                      scheduleDataInterval.finishTime) ||
                  (listActiveScheduleStartFinishTimeInterval.finishTime >
                    scheduleDataInterval.startTime &&
                    listActiveScheduleStartFinishTimeInterval.finishTime <
                      scheduleDataInterval.finishTime)
                ) {
                  return false;
                }
              }
            }
          }
        } // if (scheduleData !== null) {
        const updateScheduleDto: UpdateScheduleDTO = {
          status: 'active',
        };
        await this.scheduleService.updateByOrderUuid(
          data.orderUuid,
          updateScheduleDto,
        );

        const updateWorkDto: UpdateWorkDTO = {
          status: 'active',
        };

        await this.workService.updateByOrderUuid(data.orderUuid, updateWorkDto);

        await bot.sendMessage(
          process.env.OWNER_TELEGRAM_ID,
          `Added one cleaning on : ${workData.date[5]}${workData.date[6]}/${workData.date[8]}${workData.date[9]}/${workData.date[0]}${workData.date[1]}${workData.date[2]}${workData.date[3]}`,
        );
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }

  @Post('/create')
  async createNewCommonInfo(
    @Body() data: CommonInfoFromClientInterface,
  ): Promise<any> {
    const workIntervalsEvenFullBusy =
      await this.commonInfoService.getTeamJobIntervals(
        data.date,
        parseInt(data.discount),
        parseInt(data.duringCleaning),
      );

    const workIntervals = workIntervalsEvenFullBusy.filter((item) => {
      item.freeIntervals.length > 0;
    });

    let listFreeTeams = this.commonInfoService.findAvailableTeamsForCleaning(
      workIntervals,
      parseInt(data.arrivalFrom),
      parseInt(data.duringCleaning),
    );
    if (listFreeTeams.length === 0) {
      const res = await this.teamService.findAllByStatus('active');
      listFreeTeams = res.flatMap((item) => item.uuid);
    }

    let teamUuid = '';
    let listTeamCountHoursWork = [];
    let listTeamCountHoursSchedules = [];
    const listTeamCountHoursCommon = [];

    if (listFreeTeams.length === 1) {
      teamUuid = listFreeTeams[0];
    } else {
      listTeamCountHoursWork = await Promise.all(
        listFreeTeams.map(async (team) => {
          const res =
            await this.workService.getCountHoursActiveWorksByTeamUuid(team);
          return {
            uuid: team,
            countHoursWorks: res.total === null ? 0 : parseInt(res.total),
          };
        }),
      );

      listTeamCountHoursSchedules = await Promise.all(
        listFreeTeams.map(async (team) => {
          const res =
            await this.scheduleService.getCountHoursActiveSchedulesByTeamUuid(
              team,
            );

          return {
            uuid: team,
            countHoursWorks: res.total === null ? 0 : parseInt(res.total),
          };
        }),
      );
      listFreeTeams.map(async (team) => {
        let countHours = 0;
        listTeamCountHoursWork.forEach((element) => {
          if (element.uuid === team) {
            countHours += element.countHoursWorks;
          }
        });
        listTeamCountHoursSchedules.forEach((element) => {
          if (element.uuid === team) {
            countHours += element.countHoursWorks;
          }
        });

        listTeamCountHoursCommon.push({
          uuid: team,
          countHoursWorks: countHours,
        });
      });
      teamUuid = this.commonInfoService.findMinByField(
        listTeamCountHoursCommon,
        'countHoursWorks',
      ).uuid;
    }

    let dayOfWeek = 0;
    let weekNumber1 = 0;
    let weekNumber2 = 0;

    data.squareFeet = this.commonInfoService.cleanString(data.squareFeet);
    data.propertyAddress = this.commonInfoService.cleanString(
      data.propertyAddress,
    );
    data.apartment = this.commonInfoService.cleanString(data.apartment);
    data.firstName = this.commonInfoService.cleanString(data.firstName);
    data.lastName = this.commonInfoService.cleanString(data.lastName);
    data.email = this.commonInfoService.cleanString(data.email);
    data.phone = this.commonInfoService.cleanString(data.phone);

    try {
      let client =
        await this.clientService.getOneByPhoneAndEmailAndFirstNameAndLastname(
          data.phone,
          data.email,
          data.firstName,
          data.lastName,
        );
      if (client === null) {
        const createClientDto: CreateClientDTO = {
          name: data.firstName + ' ' + data.lastName,
          phone: data.phone,
          email: data.email,
          emailConfirm: false,
          data: '',
          status: 'active',
          password: '',
        };

        client = await this.clientService.createNewClient(createClientDto);
      }

      let house =
        await this.houseService.getOneByPropertyAddressAndApartmentSuite(
          data.propertyAddress,
          data.apartment,
        );

      if (house === null) {
        const createHouseDto: CreateHouseDTO = {
          propertyAddress: data.propertyAddress,
          apartmentSuite: data.apartment,
          status: 'active',
        };
        house = await this.houseService.createNewHouse(createHouseDto);
      }

      let commonInfo =
        await this.commonInfoService.getOneByClientUuidByHouseUuidByZipCodeBySquareFeetByDiscount(
          client.uuid,
          house.uuid,
          parseInt(data.zipCode),
          parseInt(data.squareFeet),
          parseInt(data.discount),
        );

      if (commonInfo === null) {
        const createCommonInfoDTO: CreateCommonInfoDTO = {
          clientUuid: client.uuid,
          houseUuid: house.uuid,
          zipCode: parseInt(data.zipCode),
          squareFeet: parseInt(data.squareFeet),
          discount: parseInt(data.discount),
          status: 'active',
        };
        commonInfo =
          await this.commonInfoService.createNewCommonInfo(createCommonInfoDTO);
      }

      const today = new Date();
      const createOrderDto: CreateOrderDTO = {
        date: today.toISOString().split('T')[0],
      };

      const order = await this.orderService.createNewOrder(createOrderDto);
      switch (data.discount) {
        case '1': // 1	"Every 2 Weeks = 10% discount (most popular)"
          weekNumber1 = this.commonInfoService.getWeekNumber(data.calendar);
          dayOfWeek = this.commonInfoService.getWeekDay(data.calendar);
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

          const createScheduleDto_12: CreateScheduleDTO = {
            commonInfoUuid: commonInfo.uuid,
            teamUuid: teamUuid,
            dayOfWeek: dayOfWeek,
            numberOfWeek: weekNumber1,
            startTime: parseInt(data.arrivalFrom),
            finishTime:
              parseInt(data.arrivalFrom) +
              parseInt(data.duringStandardCleaning),
            price: parseInt(data.recurringCleanPrice),
            bedrooms: parseInt(data.numberBedrooms),
            bathrooms: parseInt(data.numberBathrooms),
            excludeBedrooms: parseInt(data.excludeBedrooms),
            excludeBathrooms: parseInt(data.excludeBathrooms),
            status: 'notpaid',
            orderUuid: order.uuid,
          };

          const createScheduleDto_22: CreateScheduleDTO = {
            commonInfoUuid: commonInfo.uuid,
            teamUuid: teamUuid,
            dayOfWeek: dayOfWeek,
            numberOfWeek: weekNumber2,
            startTime: parseInt(data.arrivalFrom),
            finishTime:
              parseInt(data.arrivalFrom) +
              parseInt(data.duringStandardCleaning),
            price: parseInt(data.recurringCleanPrice),
            bedrooms: parseInt(data.numberBedrooms),
            bathrooms: parseInt(data.numberBathrooms),
            excludeBedrooms: parseInt(data.excludeBedrooms),
            excludeBathrooms: parseInt(data.excludeBathrooms),
            status: 'notpaid',
            orderUuid: order.uuid,
          };

          await this.scheduleService.createSeveral([
            createScheduleDto_12,
            createScheduleDto_22,
          ]);

          console.log(
            'data.interiorWindows ',
            data.interiorWindows,
            typeof data.interiorWindows,
          );

          const createWorkDto1: CreateWorkDTO = {
            commonInfoUuid: commonInfo.uuid,
            teamUuid: teamUuid,
            typeClean: parseInt(data.typeCleaning),
            houseCondition: parseInt(data.conditionHome),
            date: data.calendar,
            startTime: parseInt(data.arrivalFrom),
            finishTime:
              parseInt(data.arrivalFrom) + parseInt(data.duringCleaning),
            interiorWindows: data.interiorWindows,
            insideOven: data.insideOven,
            wipeBaseboards: data.wipeBaseboards,
            insideFridge: data.insideFridge,
            insideCabinets: data.insideCabinets,
            pets: data.pets === '1' ? true : false,
            price: parseInt(data.oneCleanPrice),
            bedrooms: parseInt(data.numberBedrooms),
            bathrooms: parseInt(data.numberBathrooms),
            excludeBedrooms: parseInt(data.excludeBedrooms),
            excludeBathrooms: parseInt(data.excludeBathrooms),
            status: 'notpaid',
            orderUuid: order.uuid,
          };

          await this.workService.createNewWork(createWorkDto1);

          break;
        case '2': // 2	"Every 4 Weeks = 5% discount"
          weekNumber1 = this.commonInfoService.getWeekNumber(data.calendar);
          dayOfWeek = this.commonInfoService.getWeekDay(data.calendar);

          const createScheduleDto: CreateScheduleDTO = {
            commonInfoUuid: commonInfo.uuid,
            teamUuid: teamUuid,
            dayOfWeek: dayOfWeek,
            numberOfWeek: weekNumber1,
            startTime: parseInt(data.arrivalFrom),
            finishTime:
              parseInt(data.arrivalFrom) +
              parseInt(data.duringStandardCleaning),
            price: parseInt(data.recurringCleanPrice),
            bedrooms: parseInt(data.numberBedrooms),
            bathrooms: parseInt(data.numberBathrooms),
            excludeBedrooms: parseInt(data.excludeBedrooms),
            excludeBathrooms: parseInt(data.excludeBathrooms),
            status: 'notpaid',
            orderUuid: order.uuid,
          };

          await this.scheduleService.create(createScheduleDto);

          const createWorkDto2: CreateWorkDTO = {
            commonInfoUuid: commonInfo.uuid,
            teamUuid: teamUuid,
            typeClean: parseInt(data.typeCleaning),
            houseCondition: parseInt(data.conditionHome),
            date: data.calendar,
            startTime: parseInt(data.arrivalFrom),
            finishTime:
              parseInt(data.arrivalFrom) + parseInt(data.duringCleaning),
            interiorWindows: data.interiorWindows,
            insideOven: data.insideOven,
            wipeBaseboards: data.wipeBaseboards,
            insideFridge: data.insideFridge,
            insideCabinets: data.insideCabinets,
            pets: data.pets === '1' ? true : false,
            price: parseInt(data.oneCleanPrice),
            bedrooms: parseInt(data.numberBedrooms),
            bathrooms: parseInt(data.numberBathrooms),
            excludeBedrooms: parseInt(data.excludeBedrooms),
            excludeBathrooms: parseInt(data.excludeBathrooms),
            status: 'notpaid',
            orderUuid: order.uuid,
          };
          await this.workService.createNewWork(createWorkDto2);
          break;
        case '3': // 3	"Weekly = 15% discount"
          dayOfWeek = this.commonInfoService.getWeekDay(data.calendar);
          const createScheduleDto_1: CreateScheduleDTO = {
            commonInfoUuid: commonInfo.uuid,
            teamUuid: teamUuid,
            dayOfWeek: dayOfWeek,
            numberOfWeek: 1,
            startTime: parseInt(data.arrivalFrom),
            finishTime:
              parseInt(data.arrivalFrom) +
              parseInt(data.duringStandardCleaning),
            price: parseInt(data.recurringCleanPrice),
            bedrooms: parseInt(data.numberBedrooms),
            bathrooms: parseInt(data.numberBathrooms),
            excludeBedrooms: parseInt(data.excludeBedrooms),
            excludeBathrooms: parseInt(data.excludeBathrooms),
            status: 'notpaid',
            orderUuid: order.uuid,
          };
          const createScheduleDto_2: CreateScheduleDTO = {
            commonInfoUuid: commonInfo.uuid,
            teamUuid: teamUuid,
            dayOfWeek: dayOfWeek,
            numberOfWeek: 2,
            startTime: parseInt(data.arrivalFrom),
            finishTime:
              parseInt(data.arrivalFrom) +
              parseInt(data.duringStandardCleaning),
            price: parseInt(data.recurringCleanPrice),
            bedrooms: parseInt(data.numberBedrooms),
            bathrooms: parseInt(data.numberBathrooms),
            excludeBedrooms: parseInt(data.excludeBedrooms),
            excludeBathrooms: parseInt(data.excludeBathrooms),
            status: 'notpaid',
            orderUuid: order.uuid,
          };
          const createScheduleDto_3: CreateScheduleDTO = {
            commonInfoUuid: commonInfo.uuid,
            teamUuid: teamUuid,
            dayOfWeek: dayOfWeek,
            numberOfWeek: 3,
            startTime: parseInt(data.arrivalFrom),
            finishTime:
              parseInt(data.arrivalFrom) +
              parseInt(data.duringStandardCleaning),
            price: parseInt(data.recurringCleanPrice),
            bedrooms: parseInt(data.numberBedrooms),
            bathrooms: parseInt(data.numberBathrooms),
            excludeBedrooms: parseInt(data.excludeBedrooms),
            excludeBathrooms: parseInt(data.excludeBathrooms),
            status: 'notpaid',
            orderUuid: order.uuid,
          };
          const createScheduleDto_4: CreateScheduleDTO = {
            commonInfoUuid: commonInfo.uuid,
            teamUuid: teamUuid,
            dayOfWeek: dayOfWeek,
            numberOfWeek: 4,
            startTime: parseInt(data.arrivalFrom),
            finishTime:
              parseInt(data.arrivalFrom) +
              parseInt(data.duringStandardCleaning),
            price: parseInt(data.recurringCleanPrice),
            bedrooms: parseInt(data.numberBedrooms),
            bathrooms: parseInt(data.numberBathrooms),
            excludeBedrooms: parseInt(data.excludeBedrooms),
            excludeBathrooms: parseInt(data.excludeBathrooms),
            status: 'notpaid',
            orderUuid: order.uuid,
          };

          await this.scheduleService.createSeveral([
            createScheduleDto_1,
            createScheduleDto_2,
            createScheduleDto_3,
            createScheduleDto_4,
          ]);

          const createWorkDto3: CreateWorkDTO = {
            commonInfoUuid: commonInfo.uuid,
            teamUuid: teamUuid,
            typeClean: parseInt(data.typeCleaning),
            houseCondition: parseInt(data.conditionHome),
            date: data.calendar,
            startTime: parseInt(data.arrivalFrom),
            finishTime:
              parseInt(data.arrivalFrom) + parseInt(data.duringCleaning),
            interiorWindows: data.interiorWindows,
            insideOven: data.insideOven,
            wipeBaseboards: data.wipeBaseboards,
            insideFridge: data.insideFridge,
            insideCabinets: data.insideCabinets,
            pets: data.pets === '1' ? true : false,
            price: parseInt(data.oneCleanPrice),
            bedrooms: parseInt(data.numberBedrooms),
            bathrooms: parseInt(data.numberBathrooms),
            excludeBedrooms: parseInt(data.excludeBedrooms),
            excludeBathrooms: parseInt(data.excludeBathrooms),
            status: 'notpaid',
            orderUuid: order.uuid,
          };

          await this.workService.createNewWork(createWorkDto3);
          break;
        case '4': // 4	"One Time"
          const createWorkDto4: CreateWorkDTO = {
            commonInfoUuid: commonInfo.uuid,
            teamUuid: teamUuid,
            typeClean: parseInt(data.typeCleaning),
            houseCondition: parseInt(data.conditionHome),
            date: data.calendar,
            startTime: parseInt(data.arrivalFrom),
            finishTime:
              parseInt(data.arrivalFrom) + parseInt(data.duringCleaning),
            interiorWindows: data.interiorWindows,
            insideOven: data.insideOven,
            wipeBaseboards: data.wipeBaseboards,
            insideFridge: data.insideFridge,
            insideCabinets: data.insideCabinets,
            pets: data.pets === '1' ? true : false,
            price: parseInt(data.oneCleanPrice),
            bedrooms: parseInt(data.numberBedrooms),
            bathrooms: parseInt(data.numberBathrooms),
            excludeBedrooms: parseInt(data.excludeBedrooms),
            excludeBathrooms: parseInt(data.excludeBathrooms),
            status: 'notpaid',
            orderUuid: order.uuid,
          };

          await this.workService.createNewWork(createWorkDto4);
          break;
      }
      return { order: order.uuid };
    } catch (error) {
      return false;
    }
  }
}
