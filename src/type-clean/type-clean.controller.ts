import { Controller, Get } from '@nestjs/common';
import { TypeCleanService } from './type-clean.service';
import { TypeClean } from './type-clean.entity';

@Controller('type-clean')
export class TypeCleanController {
  constructor(private readonly typeCleanService: TypeCleanService) {}

  @Get('/get-all')
  async getAllListTypeClean(): Promise<TypeClean[]> {
    return this.typeCleanService.getAllListTypeClean();
  }
  @Get('/get-all-no-standart')
  async getAllListTypeCleanNoStandart(): Promise<TypeClean[]> {
    return this.typeCleanService.getAllListTypeCleanNoStandart();
  }
}
