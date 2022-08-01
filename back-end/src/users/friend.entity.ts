import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum State {
  NO_RECORD = 'no_record',
  PENDING_A_B = 'pending_A_B',
  PENDING_B_A = 'pending_B_A',
  FRIENDS = 'friends',
  BLOCKED_A_B = 'blocked_A_B',
  BLOCKED_B_A = 'blocked_B_A',
}

@Entity()
class Friend {
  @PrimaryColumn({ unique: true })
  public userA: string;

  @PrimaryColumn({ unique: true })
  public userB: string;

  @Column()
  public state: State;
}

export default Friend;
