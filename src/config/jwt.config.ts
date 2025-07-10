import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '2h' },
    };
  },
};
