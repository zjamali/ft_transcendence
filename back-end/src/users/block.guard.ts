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

    const blockedByUsers: User[] = await this.usersService.getBlockedByUsers(
      user.id,
    );
    const id = request.params.id;

    if (blockedByUsers.length != 0) {
      //
      const found = blockedByUsers.find((element: User) => {
        return element.id === id;
      });
      if (found) {
        return false;
      } else {
        return true;
      }
      //
    }
    // if (found) return true;
    // return false;
    // }
    return true;
  }
}
