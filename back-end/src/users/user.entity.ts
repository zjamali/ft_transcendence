import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import Friend from './friend.entity';

@Entity()
class User {
  @PrimaryColumn()
  public id: string;

  @Column()
  public userName: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  public image: string;

  @Column({ default: true })
  public isOnline: boolean;

  @Column({ default: false })
  public isPlaying: boolean;

  @ManyToMany(() => Friend)
  @JoinTable()
  public friends: Friend[];
}

export default User;
