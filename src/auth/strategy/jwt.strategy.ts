import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { JwtPayload } from '../jwt-payload.interface';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { User } from 'src/user/user.entity';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
    this.logger.warn('JwtStrategy initialized');
  }

  async validate(payload: JwtPayload): Promise<any> {
    let user: User = null;
    try {
      user = await this.userService.getOneUserByUuidByUsername(
        payload.sub,
        payload.username,
      );
    } catch (error) {
      console.log(error);
    }
    return user;
  }
}
