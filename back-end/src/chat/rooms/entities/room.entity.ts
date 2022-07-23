import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    default: 'Public',
  })
  roomType: string;

  @Column({ default: false })
  isProtected: boolean;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  image: string;
}

export default Room;
