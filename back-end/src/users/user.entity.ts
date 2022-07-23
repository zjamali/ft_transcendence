import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

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

}

export default User;
