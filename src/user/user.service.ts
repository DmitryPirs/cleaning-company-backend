import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { BasicService } from 'src/basic/basic.service';
import { RegisterUserDTO } from 'src/user/dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService extends BasicService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async createNewClient(commonInformation: any): Promise<any> {
    const checkDuplicateUser = await this.findOneByEmail(
      commonInformation.email,
    );

    if (checkDuplicateUser === null) {
      const createUserDto: CreateUserDTO = {
        userName:
          commonInformation.firstName + ' ' + commonInformation.lastName,
        phone: commonInformation.phone,
        email: commonInformation.email,
        emailConfirm: false,
        data: '',
        status: 'active',
        role: 'user',
        password: '',
      };
      return this.create(createUserDto);
    } else {
      return false;
    }
  }

  async createNewUser(registerUserDto: RegisterUserDTO): Promise<User> {
    const checkDuplicateUser = await this.findOneByEmail(registerUserDto.email);
    if (checkDuplicateUser === null) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(registerUserDto.password, salt);
      const createUserDto = {
        userName: registerUserDto.username,
        phone: '',
        email: registerUserDto.email,
        emailConfirm: false,
        data: '',
        status: 'active',
        role: 'user',
        password: hashedPassword,
      };

      return this.create(createUserDto);
    } else {
      return checkDuplicateUser;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getOneUserByNum(userNum: number): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.num = :userNum', { userNum })
      .getOne();
  }

  async getOneUserByUuidByUsername(
    userUuid: string,
    userName: string,
  ): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.userName = :userName', { userName })
      .andWhere('user.uuid = :userUuid', { userUuid })
      .getOne();
  }

  async getOneUserByUuidByData(userUuid: string, data: string): Promise<User> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.uuid = :userUuid', { userUuid })
      .andWhere('user.data = :data', { data })
      .getOne();
  }

  async getUserAddFieldUser(): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.addFieldsUser', 'addFieldUser')
      .getMany();
  }
}
