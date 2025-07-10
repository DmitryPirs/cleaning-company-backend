import { Module } from '@nestjs/common';
import { TypeCleanController } from './type-clean.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeClean } from './type-clean.entity';
import { TypeCleanService } from './type-clean.service';

@Module({
  imports: [TypeOrmModule.forFeature([TypeClean])],
  controllers: [TypeCleanController],
  providers: [TypeCleanService],
  exports: [TypeOrmModule, TypeCleanService],
})
export class TypeCleanModule {}
