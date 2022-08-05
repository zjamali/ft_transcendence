import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [UsersModule],
  providers: [EventsGateway, EventsService, JwtService],
  controllers: [],
  exports: [EventsService],
})
export class EventsModule {}
