import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/users/user.entity';

@Module({
  imports: [UsersModule],
  providers: [EventsGateway, EventsService, UsersService, JwtService],
  controllers: [],
  exports: [EventsService],
})
export class EventsModule {}
