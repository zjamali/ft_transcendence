import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Post('create')
  createUser(@Body() createUserDto: any) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('id/:id')
  findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }
}
