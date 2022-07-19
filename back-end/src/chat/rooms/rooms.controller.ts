import { UsersService } from 'src/users/users.service';
import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../chat.gateway';

@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  @UseGuards(JwtService)
  @Get()
  findAll(@Req() req) {
    const decodedJwtAccessToken: any = this.jwtService.decode(
      req.cookies['access_token'],
    );
    const jwtPayload: JwtPayload = { ...decodedJwtAccessToken };
    console.log('user id:', jwtPayload.id);
    if (jwtPayload.id) return this.roomsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }
  @Get(':id/members')
  async findMembers(@Param('id') id: string) {
    const room = await this.roomsService.findOne(+id);
    console.log('room members', room[0].ActiveUsers);
    return await this.getUsersData(room[0].ActiveUsers);
  }
  @Get(':id/admins')
  async findAdmins(@Param('id') id: string) {
    const room = await this.roomsService.findOne(+id);
    console.log('room admins', room[0].admins);
    if (room[0].admins && room[0].admins.length > 0)
      return await this.getUsersData(room[0].admins);
    else return [];
  }
  @Get(':id/banned')
  async findBanned(@Param('id') id: string) {
    const room = await this.roomsService.findOne(+id);
    console.log('room banned', room[0].bannedUser);
    if (room[0].bannedUser && room[0].bannedUser.length > 0)
      return await this.getUsersData(room[0].bannedUser);
    else return [];
  }
  @Get(':id/muted')
  async findMuted(@Param('id') id: string) {
    const room = await this.roomsService.findOne(+id);
    console.log('room muted', room[0].mutedUsers);
    if (room[0].mutedUsers && room[0].mutedUsers.length > 0)
      return await this.getUsersData(room[0].mutedUsers);
    else return [];
  }

  getUsersData = async (ActiveUsers) => {
    return Promise.all(
      ActiveUsers.map((userid: string) => this.usersService.findOne(userid)),
    );
  };
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
  //   return this.roomsService.update(+id, updateRoomDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roomsService.remove(+id);
  // }
}
