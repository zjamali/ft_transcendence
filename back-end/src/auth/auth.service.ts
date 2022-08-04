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
    let url: string;
    const userId: string = req.user.id;

    const user = await this.usersService.findOne(userId);
    if (user && user.isTwoFactorAuthenticationEnabled == false) {
      console.log('user does already exist');
      url = 'http://localhost:3000';
    } else if (user && user.isTwoFactorAuthenticationEnabled == true) {
      url = 'http://localhost:3000?twoFa=true';
    } else {
      console.log(
        'user does not exist, I will create it and insert it into DB',
      );
      url = 'http://localhost:3000?edit_profile=true';
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
    const { access_token } = this.jwtAuthService.signWith2FA(req.user, false);
    res.cookie('access_token', access_token);
    res.redirect(url);

    // res.setHeader('Authorization', 'Bearer ' + access_token);
    // console.log(res.getHeader('Authorization'));
    // console.log(res);
    // return req.user;
  }
}
