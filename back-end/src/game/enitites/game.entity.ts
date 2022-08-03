import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Games {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  firstPlayer: string;

  @Column()
  secondPlayer: string;

  @Column()
  scoreFirst: number;

  @Column()
  scoreSecond: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;
}
