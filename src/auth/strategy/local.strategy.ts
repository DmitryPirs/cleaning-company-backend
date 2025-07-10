import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
    this.logger.warn('LocalStrategy initialized');
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      return { status: false };
    }
    return user;
  }
}
