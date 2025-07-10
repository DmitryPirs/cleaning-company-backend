import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/user.service';
import { Logger } from '@nestjs/common';
import { JwtPayload } from '../jwt-payload.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
    this.logger.warn('JwtRefreshTokenStrategy initialized');
  }

  async validate(payload: JwtPayload): Promise<any> {
    console.log('validate refresh jwt-straetgy');
    console.log(payload);
    const user = await this.userService.getOneUserByUuidByUsername(
      payload.sub,
      payload.username,
    );
    if (!user) {
      this.logger.error('User not found');
      console.log('User not found2');

      throw new UnauthorizedException();
    }
    return user;
  }
}
