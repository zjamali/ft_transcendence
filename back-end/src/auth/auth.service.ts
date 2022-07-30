import { JwtAuthService } from './jwt-auth.service';
import { Injectable, Req, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import RequestWithUser from 'src/users/requestWithUser.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  async intraLogin(@Req() req: RequestWithUser, @Res() res: Response) {
    // console.log('Now I am in intraLogin(req)');
    // console.log(req.user);
    let url: string;
    const userId: string = req.user.id;

    const user = await this.usersService.findOne(userId);
    if (user && user.isTwoFactorAuthenticationEnabled == false) {
      console.log('user already exist');
      url = 'http://localhost:3000';
    } else if (user && user.isTwoFactorAuthenticationEnabled == true) {
      url = 'http://localhost:3000/2fa';
      res.redirect(url);
    } else {
      console.log('user doesnt exist');
      url = 'http://localhost:3000?first_time_login=true';
      this.usersService.createUser(req.user);
    }

    // if (!req.user) {
    //   console.log('No user from 42 Intra');
    //   throw new BadRequestException();
    // } else if (req.user.isTwoFactorAuthenticationEnabled == true) {
    //   return res.redirect('http://localhost:3000/2fa');
    // }
    // this.usersService.createUser(req.user); /// well well well you mustn't create the use every time

    //don't forget to set isOnline to true when loggin in ;)

    // console.log('req.user from intraLogin AuthService: ');
    // console.log(req.user);

    // console.log(access_token);
    const { access_token } = this.jwtAuthService.login(req.user);
    res.cookie('access_token', access_token);
    res.redirect(url);

    // res.setHeader('Authorization', 'Bearer ' + access_token);
    // console.log(res.getHeader('Authorization'));
    // console.log(res);
    // return req.user;
  }
}
