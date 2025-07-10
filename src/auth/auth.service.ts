import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { SignInDTO } from '../user/dto/sign-in-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenIdsStorage } from './refresh-token-ids-storage';
import { JwtRefreshTokenStrategy } from './strategy/jwt-refresh-token.strategy';
import { JwtPayload } from './jwt-payload.interface';
import { UpdateUserDTO } from 'src/user/dto/update-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  constructor(
    @InjectRepository(User)
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {}
  async signIn(signInDto: SignInDTO) {
    const user = await this.validateUser(signInDto.email, signInDto.password);
    if (!user) {
      return false;
    }

    const payload: JwtPayload = { sub: user.uuid, username: user.userName };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });

    const UpdateUserDto: UpdateUserDTO = {
      data: refreshToken,
    };
    await this.userService.updateByUuid(user.uuid, UpdateUserDto);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findOneByEmail(email);

      if (user && (await user.validatePassword(password))) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async refreshAccessToken(token: string): Promise<{ token: string }> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      await this.refreshTokenIdsStorage.validate(decoded.sub, token);
      const payload: JwtPayload = {
        sub: decoded.sub,
        username: decoded.username,
      };
      const accessToken = await this.jwtService.signAsync(payload);
      return { token: accessToken };
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async invalidateToken(accessToken: string): Promise<void> {
    try {
      const decoded: JwtPayload =
        await this.jwtService.verifyAsync(accessToken);
      const updateUserDto: UpdateUserDTO = {
        data: '',
      };
      await this.userService.updateByUuid(decoded.sub, updateUserDto);
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
