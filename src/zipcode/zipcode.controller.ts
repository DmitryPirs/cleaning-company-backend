import { Body, Controller, Get, Post } from '@nestjs/common';
import { ZipcodeService } from './zipcode.service';
import { Zipcode } from './zipcode.entity';

@Controller('zipcode')
export class ZipcodeController {
  constructor(private readonly zipcodeService: ZipcodeService) {}

  @Post('/get-one')
  async getOne(@Body() id: number): Promise<Zipcode> {
    return this.zipcodeService.findOneById(id);
  }
  @Get('/get-all')
  async getAll(): Promise<Zipcode[]> {
    console.log('zipcode/get-all');
    return await this.zipcodeService.getAll();
  }
}
