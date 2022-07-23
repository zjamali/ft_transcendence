import { JwtAuthService } from './jwt-auth.service';
import { BadRequestException, Injectable, Req, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  intraLogin(@Req() req: Request, @Res() res: Response) {
    console.log('Now I am in intraLogin(req)');
    // console.log(req.user);

    if (!req.user) {
      console.log('No user from 42 Intra');
      throw new BadRequestException();
    }
    this.usersService.createUser(req.user);
    console.log('req.user from intraLogin AuthService: ');
    console.log(req.user);
    const { access_token } = this.jwtAuthService.login(req.user);
    console.log(access_token);
    res.cookie('access_token', access_token);
    // res.setHeader('Authorization', 'Bearer ' + access_token);
    // console.log(res.getHeader('Authorization'));
    // console.log(res);
    return res.redirect('http://localhost:3000');
    // return req.user;
  }
}
