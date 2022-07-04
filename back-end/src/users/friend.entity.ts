import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import User from './user.entity';

export enum State {
  FRIENDS = 'friends',
  BLOCKED = 'blocked',
  DIGITAL = 'digital',
  NO_RECORD = 'no_record',
  PENDING_FIRST_SECOND = 'pending_first_second',
  PENDING_SECOND_FIRST = 'pending_second_first',
}

@Entity()
class Friend {
  @Column()
  public firstId: User;

  @Column()
  public secondId: User;

  @Column()
  public state: State;
}

export default Friend;
