import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
class Message {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ nullable: true })
  public roomId: string;

  @Column({ nullable: false })
  public senderId: string;

  @Column({ nullable: false })
  public senderName: string;

  @Column({ nullable: true })
  public receiverId: string;

  @Column({ nullable: false })
  public createdAt: string;

  @Column({ nullable: false })
  public content: string;

  @Column({ nullable: false })
  public isChannel: boolean;
}

export default Message;
