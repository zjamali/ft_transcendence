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
import { Express, Request, Response } from 'express';
import RequestWithUser from './interfaces/requestWithUser.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import JwtTwoFactorGuard from 'src/auth/jwt-2fa-auth.guard';
import { saveImageToStorage } from './helpers/image-storage';
import { BlockGuard } from './block.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtTwoFactorGuard)
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @Get('me')
  @UseGuards(JwtTwoFactorGuard)
  getme(@Req() req: RequestWithUser) {
    return { ...req.user };
  }

  @Post('create')
  @UseGuards(JwtTwoFactorGuard)
  async createUser(@Body() createUserDto: any) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get('id/:id')
  @UseGuards(BlockGuard)
  @UseGuards(JwtTwoFactorGuard)
  async findUserById(@Param('id') userId: string) {
    console.log('meow');
    return await this.usersService.findOne(userId);
  }

  @Post('send')
  @UseGuards(JwtTwoFactorGuard)
  async sendRequest(
    @Req() req: RequestWithUser,
    @Body() body: { relatedUserId: string },
  ) {
    return await this.usersService.sendRequest(req.user.id, body.relatedUserId);
  }

  @Post('accept')
  @UseGuards(JwtTwoFactorGuard)
  async acceptRequest(
    @Req() req: RequestWithUser,
    @Body() body: { relatedUserId: string },
  ) {
    return await this.usersService.acceptRequest(
      req.user.id,
      body.relatedUserId,
    );
  }

  @Post('unfriend')
  @UseGuards(JwtTwoFactorGuard)
  async unfriend(
    @Req() req: RequestWithUser,
    @Body() body: { relatedUserId: string },
  ) {
    return await this.usersService.removeRelation(
      req.user.id,
      body.relatedUserId,
    );
  }

  @Post('block')
  @UseGuards(JwtTwoFactorGuard)
  async blockUser(
    @Req() req: RequestWithUser,
    @Body() body: { relatedUserId: string },
  ) {
    return await this.usersService.blockUser(req.user.id, body.relatedUserId);
  }

  @Post('unblock')
  @UseGuards(JwtTwoFactorGuard)
  async unblockUser(
    @Req() req: RequestWithUser,
    @Body() body: { relatedUserId: string },
  ) {
    return await this.usersService.unblockUser(req.user.id, body.relatedUserId);
  }

  @Get('id/:id/friends')
  async getFriends(@Param('id') id: string) {
    return await this.usersService.getFriends(id);
  }

  @Get('blocked')
  @UseGuards(JwtTwoFactorGuard)
  async getBolckedUsers(@Req() req: RequestWithUser) {
    return await this.usersService.getBolckedUsers(req.user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('blockedUsers')
  async getBlockedUsers(@Req() req: RequestWithUser) {
    return await this.usersService.getBolckedUsers(req.user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('blockedByUsers')
  async getBlockedByUsers(@Req() req: RequestWithUser) {
    return await this.usersService.getBlockedByUsers(req.user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('sentrequests')
  async getSentRequests(@Req() req: RequestWithUser) {
    return await this.usersService.getSentRequests(req.user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get('recievedrequests')
  async getRecievedRequests(@Req() req: RequestWithUser) {
    return await this.usersService.getReceivedRequests(req.user.id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Get(':id/MatchesHistory')
  async getMatchesHistory(@Param('id') id: string) {
    return await this.usersService.getMatchesHistory(id);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('updateAvatar')
  @UseInterceptors(FileInterceptor('file', saveImageToStorage))
  async updateProfile(
    @Req() req: RequestWithUser,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'png|jpg|jpeg|gif',
        })
        .addMaxSizeValidator({
          maxSize: 500000000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
    const fileName = file?.filename;
    if (!fileName)
      throw new HttpException(
        'File extension must be one of [.png, .jpg, .gif, .jpeg]',
        HttpStatus.FORBIDDEN,
      );

    return await this.usersService.updateAvatar(req.user, file.path);
  }

  @UseGuards(JwtTwoFactorGuard)
  @Post('updateUserName')
  async updateUserName(
    @Req() req: RequestWithUser,
    @Body() body: { givenUserName: string },
  ) {
    return await this.usersService.updateUserName(req.user, body.givenUserName);
  }

  @Get('uploads/:imgName')
  @UseGuards(JwtTwoFactorGuard)
  getImage(@Res() res: Response, @Param('imgName') imgName: string) {
    res.sendFile(imgName, { root: './uploads' });
  }

  @Get('logOut')
  @UseGuards(JwtTwoFactorGuard)
  logOut(@Req() req: Request, @Res() res: Response) {
    this.usersService.logOut(res);
  }
}
