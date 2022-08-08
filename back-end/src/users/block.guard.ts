import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import User from './entities/user.entity';
import RequestWithUser from './interfaces/requestWithUser.interface';
import { UsersService } from './users.service';

@Injectable()
export class BlockGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}
  async canActivate(context: ExecutionContext) {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    const user: User = request.user;
    console.log(request.params.id);
    const blockedByUsers: User[] = await this.usersService.getBlockedByUsers(
      user.id,
    );
    const id = request.params.id;
    console.log(blockedByUsers);
    if (blockedByUsers.length != 0) {
      // console.log('it is not empty');
      const found = blockedByUsers.find((element: User) => {
        return element.id === id;
      });
      if (found) {
        console.log('has been founded');
        return false;
      } else {
        console.log('has not been found');
        return true;
      }
      // console.log(found);
    }
    // if (found) return true;
    // return false;
    // }
    return true;
  }
}
