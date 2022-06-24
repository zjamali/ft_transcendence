import { BadRequestException, Injectable, Req, Res } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  intraLogin(@Req() req, @Res() res) {
    console.log('Now I am in intraLogin(req)');
    // console.log(req.user);
    if (!req.user) {
      console.log('No user from 42 Intra');
      throw new BadRequestException();
    }
    this.usersService.createUser(req.user);
    return res.redirect('http://localhost:3000');
  }
}
