import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Games {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  firstPlayer: string;
  @Column()
  firstPlayerImage: string;
  @Column()
  firstPlayerUserName: string;

  @Column()
  secondPlayer: string;
  @Column()
  secondPlayerImage: string;
  @Column()
  secondPlayerUserName: string;

  @Column()
  scoreFirst: number;

  @Column()
  scoreSecond: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
