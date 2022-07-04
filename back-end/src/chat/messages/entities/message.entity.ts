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

  @Column({ nullable: false })
  public roomId: string;

  @Column({ nullable: false })
  public senderId: string;

  @Column({ nullable: false })
  public senderName: string;

  @Column({ nullable: false })
  public receiverId: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  public createdAt!: Date;

  @Column({ nullable: false })
  public content: string;
}

export default Message;
