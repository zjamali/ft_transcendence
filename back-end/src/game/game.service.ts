import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Games } from './enitites/game.entity';
import { AddGameDto } from './dto/add-game.dto';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Games)
    private readonly gameRepository: Repository<Games>,
  ) {}

  async insertGame(data: AddGameDto): Promise<Games> {
    return await this.gameRepository.save(data);
  }
}
