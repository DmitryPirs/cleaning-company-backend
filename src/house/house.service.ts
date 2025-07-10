import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { House } from '../house/house.entity';
import { Repository } from 'typeorm';
import { BasicService } from 'src/basic/basic.service';
import { CreateHouseDTO } from './dto/create-house.dto';

@Injectable()
export class HouseService extends BasicService<House> {
  constructor(
    @InjectRepository(House)
    private readonly houseRepository: Repository<House>,
  ) {
    super(houseRepository);
  }

  async createNewHouse(createHouseDto: CreateHouseDTO): Promise<House> {
    return this.create(createHouseDto);
  }

  async getOneByPropertyAddressAndApartmentSuite(
    propertyAddress: string,
    apartmentSuite: string,
  ): Promise<House> {
    return await this.houseRepository
      .createQueryBuilder('house')
      .where('house.propertyAddress = :propertyAddress', { propertyAddress })
      .andWhere('house.apartmentSuite = :apartmentSuite', { apartmentSuite })
      .getOne();
  }
}
