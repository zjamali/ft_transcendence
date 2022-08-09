import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
class User {
  @PrimaryColumn({ unique: true })
  public id: string;

  @Column({ unique: true })
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

  @Column({ nullable: true })
  public twoFactorAuthenticationSecret?: string;

  @Column({ default: false })
  public isTwoFactorAuthenticationEnabled: boolean;
}

export default User;
