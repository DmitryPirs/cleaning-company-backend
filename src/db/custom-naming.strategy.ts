import { DefaultNamingStrategy, NamingStrategyInterface } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export class CustomNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  constructor(private readonly configService: ConfigService) {
    super();
  }

  tableName(className: string, customName: string): string {
    const tableName = super.tableName(className, customName);
    const tableSuffix = this.configService.get<string>('ENDTABLE');
    return `${tableName}${tableSuffix}`;
  }
}
