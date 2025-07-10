import { Controller, Get } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/get-all')
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('/get-user-add-field')
  getUserAddField(): Promise<User[]> {
    return this.userService.getUserAddFieldUser();
  }
}
