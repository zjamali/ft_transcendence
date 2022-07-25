import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class ShutdownService implements OnModuleDestroy {
  constructor(private readonly userService: UsersService) {}

  async onModuleDestroy() {
    console.log('Executing OnDestroy Hook');
    await this.userService.logOutFromAllUsers();
  }
}
