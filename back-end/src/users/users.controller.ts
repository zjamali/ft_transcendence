import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request, Response } from 'express';
import RequestWithUser from './requestWithUser.interface';
import { saveImageToStorage } from './helpers/image-storage';
import JwtTwoFactorGuard from 'src/auth/jwt-2fa-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtTwoFactorGuard)
  getUsers() {
    return this.usersService.getUsers();
  }

  @Post('create')
  @UseGuards(JwtTwoFactorGuard)
  createUser(@Body() createUserDto: any) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('id/:id')
  @UseGuards(JwtTwoFactorGuard)
  findUserById(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('me')
  @UseGuards(JwtTwoFactorGuard)
  getme(@Req() req: RequestWithUser) {
    return { ...req.user };
  }

  @Post('send')
  @UseGuards(JwtTwoFactorGuard)
  sendRequest(
    @Req() req: RequestWithUser,
    @Body() body: { relatedUserId: string },
  ) {
    return this.usersService.sendRequest(req.user.id, body.relatedUserId);
  }

  @Post('accept')
  @UseGuards(JwtTwoFactorGuard)
  acceptRequest(
    @Req() req: RequestWithUser,
    @Body() body: { relatedUserId: string },
  ) {
    return this.usersService.acceptRequest(req.user.id, body.relatedUserId);
  }

  @Post('unfriend')
  @UseGuards(JwtTwoFactorGuard)
  unfriend(
    @Req() req: RequestWithUser,
    @Body() body: { relatedUserId: string },
  ) {
    console.log(body.relatedUserId);
    this.usersService.removeRelation(req.user.id, body.relatedUserId);
    return 'success';
  }

  @Get('id/:id/friends')
  getFriends(@Param('id') id: string) {
    return this.usersService.getFriends(id);
  }

  // @UseGuards(JwtTwoFactorGuard)
  // @Get('friends')
  // getFriends(@Req() req: RequestWithUser) {
  //   return this.usersService.getFriends(req.user.id);
  // }

  @Get('blocked')
  @UseGuards(JwtTwoFactorGuard)
  getBolckedUsers(@Req() req: RequestWithUser) {
    return this.usersService.getBolckedUsers(req.user.id);
  }

  @Post('block')
  @UseGuards(JwtTwoFactorGuard)
  blockUser(
    @Req() req: RequestWithUser,
    @Body() body: { relatedUserId: string },
  ) {
    return this.usersService.blockUser(req.user.id, body.relatedUserId);
  }

  @Post('unblock')
  @UseGuards(JwtTwoFactorGuard)
  unblockUser(
    @Req() req: RequestWithUser,
    @Body() body: { relatedUserId: string },
  ) {
    return this.usersService.unblockUser(req.user.id, body.relatedUserId);
  }

  // @Get('id/:id/sentrequests')
  // getSentRequests(@Param('id') id: string) {
  //   return this.usersService.getSentRequests(id);
  // }

  @UseGuards(JwtTwoFactorGuard)
  @Get('sentrequests')
  getSentRequests(@Req() req: RequestWithUser) {
    return this.usersService.getSentRequests(req.user.id);
  }

  // @UseGuards(JwtTwoFactorGuard)
  // @Get('recievedrequests')
  // getRecievedRequests(@Param('id') id: string) {
  //   return this.usersService.getReceivedRequests(id);
  // }

  @UseGuards(JwtTwoFactorGuard)
  @Get('recievedrequests')
  getRecievedRequests(@Req() req: RequestWithUser) {
    return this.usersService.getReceivedRequests(req.user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('blockedUsers')
  getBlockedUsers(@Req() req: RequestWithUser) {
    return this.usersService.getBolckedUsers(req.user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('blockedByUsers')
  getBlockedByUsers(@Req() req: RequestWithUser) {
    return this.usersService.getBlockedByUsers(req.user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('updateProfile')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  updateProfile(
    @Req() req: RequestWithUser,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'png|jpg|jpeg',
        })
        .addMaxSizeValidator({
          maxSize: 500000000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @Body() body: { givenUserName: string },
  ) {
    console.log(file);
    const fileName = file?.filename;
    if (!fileName)
      throw new HttpException(
        'File extension must be one of [.png, .jpg, .jpeg]',
        HttpStatus.FORBIDDEN,
      );

    return this.usersService.updateProfile(
      req.user,
      body.givenUserName,
      file.path,
    );
  }

  @Get('uploads/:imgId')
  @UseGuards(JwtTwoFactorGuard)
  getImage(@Res() res: Response, @Param('imgId') imgId: string) {
    res.sendFile(imgId, { root: './uploads' });
  }

  @Get('logOut')
  @UseGuards(JwtTwoFactorGuard)
  public logOut(@Req() req: Request, @Res() res: Response) {
    this.usersService.logOut(res);
  }
}
