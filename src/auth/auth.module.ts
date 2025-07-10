import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { ConfigModule } from '@nestjs/config';
import { RefreshTokenIdsStorage } from './refresh-token-ids-storage';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh-token.strategy';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    UserService,
    RefreshTokenIdsStorage,
    LocalStrategy,
    JwtRefreshTokenStrategy,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
