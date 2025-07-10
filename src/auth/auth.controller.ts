// import { UsersService } from '../users/users.service';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Headers,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { RegisterUserDTO } from '../user/dto/register-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from './decorators/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @Post('sign-up')
  async signUp(@Body() registerUserDto: RegisterUserDTO) {
    return this.userService.createNewUser(registerUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('/submit-feedback-form')
  async submitFeedbackForm(@Body() body: any) {
    await fetch(
      `https://api.telegram.org/bot${this.configService.get('BOT_TOKEN')}/sendmessage?chat_id=${this.configService.get('OWNER_TELEGRAM_ID')}&text=Name:
${body.feedbackName},
Email: ${body.feedbackEmail},
Text:${body.feedbackText}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return true;
  }

  @Post('/submit-payment-form')
  async submitPaymentForm(@Body() body: any) {
    console.log('submit-payment-form');
    await fetch(
      `https://api.telegram.org/bot${this.configService.get('BOT_TOKEN')}/sendmessage?chat_id=${this.configService.get('OWNER_TELEGRAM_ID')}&text=Name:${body.feedbackName}, Email: ${body.feedbackEmail}, Text:${body.feedbackText}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return true;
  }

  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ token: string }> {
    return this.authService.refreshAccessToken(refreshTokenDto.token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async invalidateToken(@Headers('authorization') authorization: string) {
    const token = authorization.split(' ')[1];
    await this.authService.invalidateToken(token);
    return true;
  }
}
