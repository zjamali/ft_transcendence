import { Module } from '@nestjs/common';
import { ShutdownService } from './shutdown.service';
import { UsersModule } from './users.module';

@Module({
  imports: [UsersModule],
  providers: [ShutdownService],
  exports: [ShutdownService],
})
export class ShutDownModule {}
