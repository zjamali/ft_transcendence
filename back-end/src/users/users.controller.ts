import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  // UploadedFile,
  UseGuards,
  // UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
// import { of } from 'rxjs';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import path from 'path';
// import * as path from 'path';
// import { Express } from 'express';
import RequestWithUser from './requestWithUser.interface';
// import * as fs from 'fs';

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
    return { ...req.user, isOnline: true };
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

  @UseGuards(JwtAuthGuard)
  @Get('blocked')
  getBolckedUsers(@Req() req: RequestWithUser) {
    return this.usersService.getBolckedUsers(req.user.id);
  }

  @Get('id/:id/sentrequests')
  getSentRequests(@Param('id') id: string) {
    return this.usersService.getSentRequests(id);
  }

  @Get('id/:id/recievedrequests')
  getRecievedRequests(@Param('id') id: string) {
    return this.usersService.getReceivedRequests(id);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req: RequestWithUser, file, cb) => {
  //         const filename: string = req.user.id;
  //         // path.parse(file.originalname).name.replace(/\s/g, '') + 'meow';
  //         const extension: string = path.parse(file.originalname).ext;
  //         // fs.unlinkSync(req.user.image);
  //         cb(null, `${filename}${extension}`);
  //       },
  //     }),
  //   }),
  // )
  // updateProfile(@UploadedFile() file: Express.Multer.File) {
  //   console.log('meow');
  //   console.log(file);
  //   return of({ imagePath: file.path });
  // }
}
