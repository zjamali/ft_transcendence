import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import RequestWithUser from './requestWithUser.interface';
import { saveImageToStorage } from './helpers/image-storage';

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
    return { ...req.user };
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

  // @UseGuards(JwtAuthGuard)
  // @Get('friends')
  // getFriends(@Req() req: RequestWithUser) {
  //   return this.usersService.getFriends(req.user.id);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('blocked')
  getBolckedUsers(@Req() req: RequestWithUser) {
    return this.usersService.getBolckedUsers(req.user.id);
  }

  @Get('id/:id/sentrequests')
  getSentRequests(@Param('id') id: string) {
    return this.usersService.getSentRequests(id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('sentrequests')
  // getSentRequests(@Req() req: RequestWithUser) {
  //   return this.usersService.getSentRequests(req.user.id);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('recievedrequests')
  getRecievedRequests(@Param('id') id: string) {
    return this.usersService.getReceivedRequests(id);
  }

  // @Get('recievedrequests')
  // getRecievedRequests(@Req() req: RequestWithUser) {
  //   return this.usersService.getReceivedRequests(req.user.id);
  // }

  @UseGuards(JwtAuthGuard)
  @Post('updateProfile')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  updateProfile(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: { givenUserName: string },
  ) {
    const fileName = file?.filename;
    if (!fileName)
      throw new HttpException(
        'File extension must be one of [.png, .jpg, .jpeg]',
        HttpStatus.FORBIDDEN,
      );

    return this.usersService.updateProfile(
      req.user,
      payload.givenUserName,
      file.path,
    );
  }
}
