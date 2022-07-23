import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { get } from 'http';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createUser(@Body() createUserDto: any) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('id/:id')
  findUserById(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getme(@Req() req: Request) {
    console.log('uWu');
    // console.log(req);
    return req.user;
  }

  @Post('send')
  sendRequest(@Body() ids: { id1: string; id2: string }) {
    this.usersService.sendRequest(ids.id1, ids.id2);
    return 'success';
  }

  @Post('accept')
  acceptRequest(@Body() ids: { id1: string; id2: string }) {
    console.log(ids.id1);
    this.usersService.acceptRequest(ids.id1, ids.id2);
    return 'success';
  }

  @Get('id/:id/friends')
  getFriends(@Param('id') id: string) {
    return this.usersService.getFriends(id);
  }

  @Get('id/:id/sentrequests')
  getSentRequests(@Param('id') id: string) {
    return this.usersService.getSentRequests(id);
  }

  @Get('id/:id/recievedrequests')
  getRecievedRequests(@Param('id') id: string) {
    return this.usersService.getReceivedRequests(id);
  }
}
