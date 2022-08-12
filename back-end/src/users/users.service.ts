import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { GameService } from 'src/game/game.service';
import { Repository } from 'typeorm/repository/Repository';
import Friend, { State } from './entities/friend.entity';
import User from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Friend)
    private readonly friendsRepository: Repository<Friend>,
    private readonly gameService: GameService,
    private readonly configService: ConfigService,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async createUser(createUserDto: any): Promise<User[]> {
    const newUser = this.usersRepository.create(createUserDto);
    return await this.usersRepository.save(newUser);
  }

  async findOne(userId: string): Promise<User> {
    const user: User = await this.usersRepository.findOne({
      where: { id: userId },
    });
    return user;
  }

  async sendRequest(relatingUserID: string, relatedUserID: string) {
    const relatedUser = await this.usersRepository.findOne({
      where: { id: relatedUserID },
    });

    if (relatedUser) {
      const userWithBigID =
        +relatedUserID > +relatingUserID ? relatedUserID : relatingUserID;
      const userWithSmallID =
        +relatedUserID < +relatingUserID ? relatedUserID : relatingUserID;

      const stateDir: State =
        relatingUserID == userWithBigID ? State.PENDING_A_B : State.PENDING_B_A;

      const relation = await this.friendsRepository.findOne({
        where: [{ userA: userWithBigID, userB: userWithSmallID }],
      });

      if (
        !relation ||
        (relation.state != State.PENDING_A_B &&
          relation.state != State.PENDING_B_A &&
          relation.state != State.FRIENDS)
      ) {
        await this.friendsRepository.save([
          {
            userA: userWithBigID,
            userB: userWithSmallID,
            state: stateDir,
          },
        ]);
      } else {
        return 'can not send request';
      }
    } else {
      return 'no related user';
    }
    return 'relatedUser';
  }

  async acceptRequest(relatingUserID: string, relatedUserID: string) {
    const relatedUser = await this.usersRepository.findOne({
      where: { id: relatedUserID },
    });

    if (relatedUser) {
      const userWithBigID =
        +relatedUserID > +relatingUserID ? relatedUserID : relatingUserID;
      const userWithSmallID =
        +relatedUserID < +relatingUserID ? relatedUserID : relatingUserID;

      const relation = await this.friendsRepository.findOne({
        where: [{ userA: userWithBigID, userB: userWithSmallID }],
      });

      if (
        (userWithBigID == relatingUserID &&
          relation.state === State.PENDING_B_A) ||
        (userWithBigID == relatedUserID && relation.state === State.PENDING_A_B)
      ) {
        await this.friendsRepository.update(
          { userA: userWithBigID, userB: userWithSmallID },
          { state: State.FRIENDS },
        );
      } else return 'can not accept request';
    } else return 'no related user';
    return relatedUser;
  }

  async removeRelation(relatingUserID: string, relatedUserID: string) {
    const userWithBigID =
      +relatedUserID > +relatingUserID ? relatedUserID : relatingUserID;
    const userWithSmallID =
      +relatedUserID < +relatingUserID ? relatedUserID : relatingUserID;

    const relation = await this.friendsRepository.findOne({
      where: [{ userA: userWithBigID, userB: userWithSmallID }],
    });

    if (
      relation?.state == State.FRIENDS ||
      relation?.state == State.PENDING_A_B ||
      relation?.state == State.PENDING_B_A
    ) {
      await this.friendsRepository
        .createQueryBuilder()
        .update({ state: State.NO_RECORD })
        .where([
          {
            userA: userWithBigID,
            userB: userWithSmallID,
          },
        ])
        .execute();
    } else {
      throw new HttpException(
        'Forbidden, Can not remove relation',
        HttpStatus.FORBIDDEN,
      );
    }
    return 'relatedUserID has been removed';
  }

  async blockUser(relatingUserID: string, relatedUserID: string) {
    const userWithBigID =
      +relatedUserID > +relatingUserID ? relatedUserID : relatingUserID;
    const userWithSmallID =
      +relatedUserID < +relatingUserID ? relatedUserID : relatingUserID;

    const relation = await this.friendsRepository.findOne({
      where: [{ userA: userWithBigID, userB: userWithSmallID }],
    });

    if (
      relation?.state != State.BLOCKED_A_B &&
      relation?.state != State.BLOCKED_B_A
    ) {
      const stateDir: State =
        relatingUserID == userWithBigID ? State.BLOCKED_A_B : State.BLOCKED_B_A;

      await this.friendsRepository
        .createQueryBuilder()
        .update({ state: stateDir })
        .where([
          {
            userA: userWithBigID,
            userB: userWithSmallID,
          },
        ])
        .execute();
    } else {
      throw new HttpException(
        'Forbidden, Can not block user',
        HttpStatus.FORBIDDEN,
      );
    }
    return 'relatedUserID has been blocked';
  }

  async unblockUser(relatingUserID: string, relatedUserID: string) {
    const userWithBigID =
      +relatedUserID > +relatingUserID ? relatedUserID : relatingUserID;
    const userWithSmallID =
      +relatedUserID < +relatingUserID ? relatedUserID : relatingUserID;

    const relation = await this.friendsRepository.findOne({
      where: [{ userA: userWithBigID, userB: userWithSmallID }],
    });

    if (
      (userWithBigID == relatingUserID &&
        relation.state === State.BLOCKED_A_B) ||
      (userWithSmallID == relatingUserID &&
        relation.state === State.BLOCKED_B_A)
    ) {
      await this.friendsRepository
        .createQueryBuilder()
        .update({ state: State.NO_RECORD })
        .where([
          {
            userA: userWithBigID,
            userB: userWithSmallID,
          },
        ])
        .returning('*')
        .execute();
    } else {
      throw new HttpException(
        'Forbidden, Can not unblock user',
        HttpStatus.FORBIDDEN,
      );
    }
    return 'relatedUserID has been unblocked';
  }

  async getFriends(userId: string): Promise<User[]> {
    const sql = `SELECT * FROM public.User WHERE id IN (SELECT "userB" FROM Friend where "userA" = $1 and "state" = 'friends') 
    Union
    SELECT * from public.User where id in (select "userA" from Friend where "userB" = $1 and "state" = 'friends')`;

    const friends: User[] = await this.usersRepository.query(sql, [userId]);
    return friends;
  }

  async getBolckedUsers(userId: string): Promise<User[]> {
    const sql = `SELECT * FROM public.User WHERE id IN (SELECT "userB" FROM Friend where "userA" = $1 and "state" = 'blocked_A_B') 
    Union
    SELECT * from public.User where id in (select "userA" from Friend where "userB" = $1 and "state" = 'blocked_B_A')`;

    const blockedUsers = await this.usersRepository.query(sql, [userId]);
    return blockedUsers;
  }

  async getBlockedByUsers(userId: string): Promise<User[]> {
    const sql = `SELECT * FROM public.User WHERE id IN (SELECT "userB" FROM Friend where "userA" = $1 and "state" = 'blocked_B_A') 
    Union
    SELECT * from public.User where id in (select "userA" from Friend where "userB" = $1 and "state" = 'blocked_A_B')`;

    const blockedByUsers = await this.usersRepository.query(sql, [userId]);
    return blockedByUsers;
  }

  async getSentRequests(userId: string) {
    const sql = `SELECT * FROM public.User WHERE id IN (SELECT "userB" FROM Friend where "userA" = $1 and "state" = 'pending_A_B') 
    Union
    SELECT * from public.User where id in (select "userA" from Friend where "userB" = $1 and "state" = 'pending_B_A')`;

    const snetRequests = await this.usersRepository.query(sql, [userId]);
    return snetRequests;
  }

  async getReceivedRequests(userId: string) {
    const sql = `SELECT * FROM public.User WHERE id IN (SELECT "userB" FROM Friend where "userA" = $1 and "state" = 'pending_B_A') 
    Union
    SELECT * from public.User where id in (select "userA" from Friend where "userB" = $1 and "state" = 'pending_A_B')`;

    const receivedRequests = await this.usersRepository.query(sql, [userId]);
    return receivedRequests;
  }

  async getMatchesHistory(userId: string) {
    const sql = `SELECT * FROM public.Games WHERE "firstPlayer" = $1 OR "secondPlayer" = $1`;

    const matchesHistory = await this.usersRepository.query(sql, [userId]);
    return matchesHistory;
  }

  async updateAvatar(currUser: User, imagePath: string) {
    const imgPathWithLink: string =
      `${process.env.SERVER_HOST}/users/` + imagePath;
    await this.usersRepository.update(currUser.id, {
      image: imgPathWithLink,
    });
    await this.gameService.updatePlayerImage(currUser.id, imgPathWithLink);
  }

  async updateUserName(currUser: User, givenUserName: string) {
    givenUserName = givenUserName.substring(0, 8);
    const foundedUser: User = await this.usersRepository.findOne({
      where: { userName: givenUserName },
    });

    if (foundedUser && foundedUser.id != currUser.id)
      throw new HttpException(
        'UserName is already taken',
        HttpStatus.FORBIDDEN,
      );

    await this.usersRepository.update(currUser.id, {
      userName: givenUserName,
    });
    return await this.gameService.updatePlayerUserName(
      currUser.id,
      givenUserName,
    );
  }

  async setTwoFactorAuthenticationSecret(userId: string, secret: string) {
    return await this.usersRepository.update(userId, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  async turnOnTwoFactorAuthentication(userId: string) {
    return await this.usersRepository.update(
      { id: userId },
      {
        isTwoFactorAuthenticationEnabled: true,
      },
    );
  }

  async setUserPlayingStatus(userId: string, status: boolean) {
    return await this.usersRepository.update(
      { id: userId },
      {
        isPlaying: status,
      },
    );
  }

  async turnOffTwoFactorAuthentication(userId: string) {
    return await this.usersRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: false,
      twoFactorAuthenticationSecret: null,
    });
  }

  logOut(@Res() res: Response) {
    res.clearCookie('access_token');
    res.redirect(`${this.configService.get('FRONT_HOST')}`);
  }

  async logOutFromAllUsers() {
    await this.usersRepository
      .createQueryBuilder()
      .update()
      .set({ isOnline: false, isPlaying: false })
      .execute();
  }
}
