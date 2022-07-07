import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum RoomType {
  PRIVATE = 'private',
  PUBLIC = 'bublic',
}

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  roomName: string;

  @Column('simple-array', { nullable: true })
  ActiveUsers: string[];

  @Column('simple-array', { nullable: true })
  bannedUser: string[];

  @Column('simple-array', { nullable: true })
  mutedUsers: string[];

  @Column({ nullable: true })
  owner: string;

  @Column('simple-array', { nullable: true })
  admins: string[];

  @Column({
    type: 'enum',
    enum: RoomType,
    default: RoomType.PUBLIC,
  })
  roomType: RoomType;

  @Column({default: false})
  isProtected : boolean;

  @Column( {nullable: true})
  password : string;
}

export default Room;
