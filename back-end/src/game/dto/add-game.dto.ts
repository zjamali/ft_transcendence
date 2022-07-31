import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class AddGameDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  @IsString()
  firstPlayer: string;

  @IsNotEmpty()
  @IsString()
  secondPlayer: string;

  @IsNotEmpty()
  @IsNumber()
  scoreFirst: number;

  @IsNotEmpty()
  @IsNumber()
  scoreSecond: number;
}
