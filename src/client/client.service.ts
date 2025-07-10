import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../client/client.entity';
import { Repository } from 'typeorm';
// import { CreateUserDTO } from './dto/create-user.dto';
import { BasicService } from 'src/basic/basic.service';
import { CreateClientDTO } from './dto/create-client.dto';

@Injectable()
export class ClientService extends BasicService<Client> {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {
    super(clientRepository);
  }

  async createNewClient(createClientDto: CreateClientDTO): Promise<any> {
    return this.create(createClientDto);
  }

  async getOneByPhoneAndEmail(phone: string, email: string): Promise<Client> {
    return await this.clientRepository
      .createQueryBuilder('client')
      .where('client.phone = :phone', { phone })
      .andWhere('client.email = :email', { email })
      .getOne();
  }
  async getOneByPhoneAndEmailAndFirstNameAndLastname(
    phone: string,
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<Client> {
    const name = firstName + ' ' + lastName;
    return await this.clientRepository
      .createQueryBuilder('client')
      .where('client.phone = :phone', { phone })
      .andWhere('client.email = :email', { email })
      .andWhere('client.name = :name', { name })
      .getOne();
  }
}
