import { Injectable } from '@nestjs/common';
import { TypeClean } from './type-clean.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasicService } from 'src/basic/basic.service';

@Injectable()
export class TypeCleanService extends BasicService<TypeClean> {
  constructor(
    @InjectRepository(TypeClean)
    private readonly typeCleanRepository: Repository<TypeClean>,
  ) {
    super(typeCleanRepository);
  }

  async getAllListTypeClean(): Promise<TypeClean[]> {
    return await this.typeCleanRepository
      .createQueryBuilder('typeClean')
      .orderBy('typeClean.order', 'ASC')
      .where('typeClean.status = :status', { status: 'active' })
      .getMany();
  }
  async getAllListTypeCleanNoStandart(): Promise<TypeClean[]> {
    return await this.typeCleanRepository
      .createQueryBuilder('typeClean')
      .orderBy('typeClean.order', 'ASC')
      .where('typeClean.status = :status', { status: 'active' })
      .andWhere('typeClean.name <> :type', { type: 'Standard Cleaning' })
      .getMany();
  }
}
