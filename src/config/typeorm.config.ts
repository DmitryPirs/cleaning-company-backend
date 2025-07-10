import { ConfigService } from '@nestjs/config';
import { CustomNamingStrategy } from '../db/custom-naming.strategy';
import { DataSource } from 'typeorm';
import 'dotenv/config';

const configService = new ConfigService();

export const connectionSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD.toString(),
  database: process.env.POSTGRES_DATABASE,
  synchronize: false,
  dropSchema: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  namingStrategy: new CustomNamingStrategy(configService),
  migrations: ['src/database/migrations/*.ts'],
});
