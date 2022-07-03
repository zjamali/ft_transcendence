import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [EventsGateway, EventsService, UsersService, JwtService],
  controllers: []
})
export class EventsModule {}
