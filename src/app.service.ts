import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const https = require('https');

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}
  getHello(): string {
    return 'Hello World!';
  }

  setWebHookBot(): boolean {
    https
      .get(
        `https://api.telegram.org/bot${process.env.BOT_TOKEN}/setwebhook?url=${process.env.SET_WEBHOOK_URL}/?allowed_updates=["message", "edited_message", "channel_post","edited_channel_post", "inline_query","chosen_inline_result", "callback_query", "shipping_query", "pre_checkout_query","poll", "poll_answer", "my_chat_member","chat_member","chat_join_reques"]`,
        (res) => {
          res.on('data', (d) => {
            const json = JSON.parse(d);
            console.log('json=');
            console.log(json);
          });
        },
      )
      .on('error', (e) => {
        console.error(`Ошибка тут ${e}`);
        throw new Error(
          'Ошибка обновления вебхуков в файле Index ' + e.message,
        );
      });
    return true;
  }
}
