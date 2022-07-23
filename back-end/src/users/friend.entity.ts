import { Column, Entity, PrimaryColumn } from 'typeorm';

export enum State {
  NO_RECORD = 'no_record',
  PENDING = 'pending',
  FRIENDS = 'friends',
  BLOCKED = 'blocked',
}

@Entity()
class Friend {
  @PrimaryColumn()
  public relatingUserID: string;

  @PrimaryColumn()
  public relatedUserID: string;

  @Column()
  public state: State;
}

export default Friend;
