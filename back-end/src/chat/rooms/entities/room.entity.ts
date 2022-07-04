import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  roomName: string;

  @Column()
  user1Id: string;

  @Column()
  user2Id: string;
}

export default Room;
