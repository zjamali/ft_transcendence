import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Subject } from 'rxjs';
import { UsersService } from './users.service';

@Injectable()
export class ShutdownService implements OnModuleDestroy {
  constructor(private readonly userService: UsersService) {}
  // Create an rxjs Subject that your application can subscribe to
  private shutdownListener$: Subject<void> = new Subject();

  // Your hook will be executed
  async onModuleDestroy() {
    console.log('Executing OnDestroy Hook');
    // const id = '62225';
    await this.userService.logOutFromAllUsers();
    // const user: User = this.usersRepository.findOne(id);
    // this.usersService.logOutFromAllUsers();
    // this.usersRepository.update({ id }, { isOnline: false });
  }
  // Subscribe to the shutdown in your main.ts
  // subscribeToShutdown(shutdownFn: () => void): void {
  //   this.shutdownListener$.subscribe(() => shutdownFn());
  // }

  subscribeToShutdown(): void {
    this.shutdownListener$.subscribe(() =>
      this.userService.logOutFromAllUsers(),
    );
  }
  // Emit the shutdown event
  // shutdown() {
  //   this.shutdownListener$.next();
  // }
}
