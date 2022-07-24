import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import User from './user.entity';
import Friend from './friend.entity';
import { ShutdownService } from './shutdown.service';
import { UsersModule } from './users.module';

@Module({
  imports: [UsersModule],
  providers: [ShutdownService],
  exports: [ShutdownService],
})
export class ShutDownModule {}
