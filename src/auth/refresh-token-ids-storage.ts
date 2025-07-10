import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

export class InvalidatedRefreshTokenError extends Error {}

@Injectable()
export class RefreshTokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  // private redisClient: Redis;
  constructor(
    private configService: ConfigService,
    private readonly userService: UserService,
  ) {}
  onApplicationBootstrap() {
    //   this.redisClient = new Redis({
    //     host: this.configService.get('REDIS_HOST'),
    //     port: this.configService.get('REDIS_PORT'),
    //   });
  }

  onApplicationShutdown(signal?: string) {
    console.log(signal);
    // return this.redisClient.quit();
  }

  async validate(uuid: string, token: string): Promise<boolean> {
    const user = await this.userService.getOneUserByUuidByData(uuid, token);
    if (user === null) {
      throw new InvalidatedRefreshTokenError();
    }
    return true;
  }
}
