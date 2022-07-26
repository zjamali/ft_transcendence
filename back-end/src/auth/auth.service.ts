import { JwtAuthService } from './jwt-auth.service';
import { BadRequestException, Injectable, Req, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import RequestWithUser from 'src/users/requestWithUser.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  intraLogin(@Req() req: RequestWithUser, @Res() res: Response) {
    console.log('Now I am in intraLogin(req)');
    // console.log(req.user);

    if (!req.user) {
      console.log('No user from 42 Intra');
      throw new BadRequestException();
    } else if (req.user.isTwoFactorAuthenticationEnabled == true) {
      return res.redirect('http://localhost:3000/2fa');
    }
    this.usersService.createUser(req.user); /// well well well you mustn't create the use every time
    //don't forget to set isOnline to true when loggin in ;)

    // console.log('req.user from intraLogin AuthService: ');
    // console.log(req.user);
    const { access_token } = this.jwtAuthService.login(req.user);
    console.log(access_token);
    res.cookie('access_token', access_token);
    return res.redirect('http://localhost:3000');

    // res.setHeader('Authorization', 'Bearer ' + access_token);
    // console.log(res.getHeader('Authorization'));
    // console.log(res);
    // return req.user;
  }
}
