import { Body, Controller, Options, Param, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user/user.service';
import { CommonInfoService } from './common-info/common-info.service';
import { TimeService } from './time/time.service';
const TelegramBot = require('node-telegram-bot-api');

@Controller()
export class AppController {
  constructor(
    private readonly timeService: TimeService,
    private readonly userService: UserService,
    private readonly commonInfoService: CommonInfoService,
    private readonly configService: ConfigService,
  ) {}

  @Options('*')
  handleOptions() {
    return '';
  }

  isValidDateFormat(dateString: string) {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(dateString);
  }

  @Post('/:token')
  async handlePost(
    @Query() query: any,
    @Param() params: any,
    @Body() body: any,
  ): Promise<string> {
    const bot = new TelegramBot(process.env.BOT_TOKEN);
    if (params.token === this.configService.get<string>('MY_TOKEN')) {
      let telegramUserId = 0;
      if (body.callback_query !== undefined) {
        bot.answerCallbackQuery(body.callback_query.id);
        if (body.callback_query.data.includes('cancel')) {
          const args = body.callback_query.data.split(':');
          await this.commonInfoService.deleteWorkOrScheduleByUuid(args[1]);

          try {
            await bot.deleteMessage(
              body.callback_query.message.chat.id,
              body.callback_query.message.message_id,
            );
          } catch (error) {
            throw new Error(error.message);
          }

          await bot.sendMessage(
            body.callback_query.from.id,
            'All client cleanings have been cancelled.',
          );
        }
      } else if (body.message.text !== undefined) {
        telegramUserId = body.message.from.id;
        if (
          telegramUserId ===
            parseInt(this.configService.get<string>('OWNER_TELEGRAM_ID')) ||
          telegramUserId ===
            parseInt(this.configService.get<string>('ADMIN_TELEGRAM_ID'))
        ) {
          const args = body.message.text.split(' ');
          const dateToday = this.userService.formatDate(Date.now());
          const listAllTime = await this.timeService.findAllByStatus('active');
          if (body.message.text === '/start') {
            await bot.sendMessage(
              body.message.chat.id,
              `Please use commands:

/today

/date 10/16/2024`,
            );
          }
          if (body.message.text === '/today') {
            const scheduleData =
              await this.commonInfoService.getAllActiveWorksAndSchedulesByDate(
                dateToday,
              );

            await bot.sendMessage(
              body.message.chat.id,
              `Schedule for today (${dateToday[5]}${dateToday[6]}/${dateToday[8]}${dateToday[9]}/${dateToday[0]}${dateToday[1]}${dateToday[2]}${dateToday[3]})`,
            );
            if (scheduleData.length === 0) {
              await bot.sendMessage(
                body.message.chat.id,
                'No cleaning for today',
              );
            } else {
              const sendPromises = scheduleData.map(async (element, index) => {
                await bot.sendMessage(
                  body.message.chat.id,
                  `<strong>Team:</strong> ${element.teamName}
<strong>Address:</strong> ${element.zipCode}, ${element.zipCodeCity}, ${element.zipCodeState},${element.housePropertyAddress}${element.houseApartmentSuite === '' ? '' : ', ' + element.houseApartmentSuite}
${element.squareFeet} sq.feets, ${element.typeCleaning} (${element.houseCondition}),
<strong>Time:</strong> ${listAllTime[element.startTime].name}-${listAllTime[element.finishTime].name}
<strong>Client:</strong> ${element.clientName}, ${element.clientPhone}`,
                  {
                    reply_markup: {
                      inline_keyboard: [
                        [
                          {
                            text: 'Cancel all cleanings',
                            callback_data: `cancel:${element.uuid}`,
                          },
                        ],
                      ],
                    },
                    parse_mode: 'HTML',
                  },
                );
              });
              await Promise.all(sendPromises);
            }
          } else if (args[0] === '/date') {
            if (this.isValidDateFormat(args[1])) {
              const date = args[1];
              await bot.sendMessage(
                body.message.chat.id,
                `Schedule for ${date}`,
              );
              const scheduleData =
                await this.commonInfoService.getAllActiveWorksAndSchedulesByDate(
                  `${date[6]}${date[7]}${date[8]}${date[9]}-${date[0]}${date[1]}-${date[3]}${date[4]}`,
                );
              if (scheduleData.length === 0) {
                await bot.sendMessage(
                  body.message.chat.id,
                  `No cleaning for ${date}`,
                );
              } else {
                const sendPromises = scheduleData.map(async (element) => {
                  await bot.sendMessage(
                    body.message.chat.id,
                    `<strong>Team:</strong> ${element.teamName}
<strong>Address:</strong> ${element.zipCode}, ${element.zipCodeCity}, ${element.zipCodeState},${element.housePropertyAddress}${element.houseApartmentSuite === '' ? '' : ', ' + element.houseApartmentSuite}
${element.squareFeet} sq.feets, ${element.typeCleaning} (${element.houseCondition}),
<strong>Time:</strong> ${listAllTime[element.startTime].name}-${listAllTime[element.finishTime].name}
<strong>Client:</strong> ${element.clientName}, ${element.clientPhone}`,
                    {
                      reply_markup: {
                        inline_keyboard: [
                          [
                            {
                              text: 'Cancel all cleanings',
                              callback_data: `cancel:${element.uuid}`,
                            },
                          ],
                        ],
                      },
                      parse_mode: 'HTML',
                    },
                  );
                });
                await Promise.all(sendPromises);
              }
            } else {
              await bot.sendMessage(
                body.message.chat.id,
                'Bad date format. Required format: /date 05/15/2024',
              );
            }
          }
        }
      }

      return `ok token`;
    } else {
      return `no token`;
    }
  }
}
