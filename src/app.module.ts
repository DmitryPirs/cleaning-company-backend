import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomNamingStrategy } from './db/custom-naming.strategy';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { TeamController } from './team/team.controller';
import { TeamService } from './team/team.service';
import { TeamModule } from './team/team.module';
import { GlobalConfigModule } from './config/global-config.module';
import { WorkService } from './work/work.service';
import { WorkModule } from './work/work.module';
import { HouseService } from './house/house.service';
import { HouseModule } from './house/house.module';
import { TimeService } from './time/time.service';
import { TimeModule } from './time/time.module';
import { ConditionHouseController } from './condition-house/condition-house.controller';
import { ConditionHouseModule } from './condition-house/condition-house.module';
import { ConditionHouseService } from './condition-house/condition-house.service';
import { TypeCleanService } from './type-clean/type-clean.service';
import { TypeCleanModule } from './type-clean/type-clean.module';
import { DiscountModule } from './discount/discount.module';
import { DiscountController } from './discount/discount.controller';
import { DiscountService } from './discount/discount.service';
import { ZipcodeController } from './zipcode/zipcode.controller';
import { ZipcodeService } from './zipcode/zipcode.service';
import { ZipcodeModule } from './zipcode/zipcode.module';
import { BasicModule } from './basic/basic.module';
import { BasicService } from './basic/basic.service';
import { CommonInfoController } from './common-info/common-info.controller';
import { CommonInfoModule } from './common-info/common-info.module';
import { ScheduleService } from './schedule/schedule.service';
import { ScheduleModule } from './schedule/schedule.module';
import { ClientService } from './client/client.service';
import { ClientModule } from './client/client.module';
import { PriceService } from './price/price.service';
import { PriceModule } from './price/price.module';
import { OrderService } from './order/order.service';
import { OrderController } from './order/order.controller';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    GlobalConfigModule,
    AuthModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USERNAME'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        synchronize: false,
        dropSchema: false,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        namingStrategy: new CustomNamingStrategy(configService),
        migrations: [__dirname + '/database/migration/*{.ts,.js}}'],
      }),
      inject: [ConfigService],
    }),

    TeamModule,
    WorkModule,
    HouseModule,
    TimeModule,
    ConditionHouseModule,
    TypeCleanModule,
    DiscountModule,
    ZipcodeModule,
    BasicModule,
    CommonInfoModule,
    ScheduleModule,
    ClientModule,
    PriceModule,
    OrderModule,
  ],
  controllers: [
    AppController,
    UserController,
    TeamController,
    DiscountController,
    ConditionHouseController,
    ZipcodeController,
    CommonInfoController,
    OrderController,
  ],
  providers: [
    AppService,
    UserService,
    TeamService,
    WorkService,
    HouseService,
    TimeService,
    ConditionHouseService,
    TypeCleanService,
    DiscountService,
    ZipcodeService,
    BasicService,
    ScheduleService,
    ClientService,
    PriceService,
    OrderService,
  ],
})
export class AppModule {}
