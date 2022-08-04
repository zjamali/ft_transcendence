import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class AddGameDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  @IsString()
  firstPlayer: string;
  @IsString()
  firstPlayerImage: string;
  @IsString()
  firstPlayerUserName: string;

  @IsNotEmpty()
  @IsString()
  secondPlayer: string;
  @IsString()
  secondPlayerImage: string;
  @IsString()
  secondPlayerUserName: string;

  @IsNotEmpty()
  @IsNumber()
  scoreFirst: number;

  @IsNotEmpty()
  @IsNumber()
  scoreSecond: number;
}
