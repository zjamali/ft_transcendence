import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'express';
import { Repository } from 'typeorm/repository/Repository';
import Friend, { State } from './friend.entity';
import User from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Friend)
    private readonly friendsRepository: Repository<Friend>,
  ) {}

  getUsers() {
    return this.usersRepository.find();
  }

  createUser(createUserDto: any) {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne({ where: { id: id } });
  }

  async sendRequest(relatingUserID: string, relatedUserID: string) {
    //find if relatedUserId exist within users repository
    const relatedUser = await this.usersRepository.findOne({
      where: { id: relatedUserID },
    });

    //if yes
    //insert relation
    //else
    //return null or throw error
    if (relatedUser) {
      //insert relation
      const userWithBigID =
        +relatedUserID > +relatingUserID ? relatedUserID : relatingUserID;
      const userWithSmallID =
        +relatedUserID < +relatingUserID ? relatedUserID : relatingUserID;

      const stateDir: State =
        relatingUserID == userWithBigID ? State.PENDING_A_B : State.PENDING_B_A;

      /* ************************ */
      //HINT: don't forget to check if the relation is already pending | friends , if so no need to change it
      /* ************************ */
      const relation = await this.friendsRepository.findOne({
        where: [{ userA: userWithBigID, userB: userWithSmallID }],
      });

      if (
        !relation ||
        (relation.state != State.PENDING_A_B &&
          relation.state != State.PENDING_B_A &&
          relation.state != State.FRIENDS)
      ) {
        this.friendsRepository.save([
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
    //find if relatedUserId exist within users repository
    const relatedUser = await this.usersRepository.findOne({
      where: { id: relatedUserID },
    });
    //if yes
    //update relation
    //else
    //return null or throw error
    if (relatedUser) {
      //update relation
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

  async getFriends(userId: string): Promise<User[]> {
    const sql = `SELECT * FROM public.User WHERE id IN (SELECT "userB" FROM Friend where "userA" = $1 and "state" = 'friends') 
    Union
    SELECT * from public.User where id in (select "userA" from Friend where "userB" = $1 and "state" = 'friends')`;

    const friends = this.usersRepository.query(sql, [userId]);
    return friends;
  }

  ///////fix this
  async getBolckedUsers(userId: string): Promise<User[]> {
    // const sql = `SELECT * FROM public.User WHERE id IN (SELECT "relatedUserID" FROM Friend where "relatingUserID" = $1 and "state" = 'blocked')`;

    const sql = `SELECT * FROM public.User WHERE id IN (SELECT "userB" FROM Friend where "userA" = $1 and "state" = 'blocked_A_B') 
    Union
    SELECT * from public.User where id in (select "userA" from Friend where "userB" = $1 and "state" = 'blocked_B_A')`;

    const blockedUsers = this.usersRepository.query(sql, [userId]);
    return blockedUsers;
  }

  ///////fix this
  async getBlockedByUsers(userId: string): Promise<User[]> {
    // const sql = `SELECT * FROM public.User WHERE id IN (SELECT "relatingUserID" FROM Friend where "relatedUserID" = $1 and "state" = 'blocked')`;

    const sql = `SELECT * FROM public.User WHERE id IN (SELECT "userB" FROM Friend where "userA" = $1 and "state" = 'blocked_B_A') 
    Union
    SELECT * from public.User where id in (select "userA" from Friend where "userB" = $1 and "state" = 'blocked_A_B')`;

    const blockedByUsers = this.usersRepository.query(sql, [userId]);
    return blockedByUsers;
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
      this.friendsRepository
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

      this.friendsRepository
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
      this.friendsRepository
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

  async getSentRequests(userId: string) {
    // await this.friendsRepository.find({
    //   where: [{ relatedUserID: userId, state: State.PENDING }],
    // });

    // const sql = `SELECT * FROM public.User WHERE id IN (SELECT "relatedUserID" FROM Friend where "relatingUserID" = $1 and "state" = 'pending')`;

    const sql = `SELECT * FROM public.User WHERE id IN (SELECT "userB" FROM Friend where "userA" = $1 and "state" = 'pending_A_B') 
    Union
    SELECT * from public.User where id in (select "userA" from Friend where "userB" = $1 and "state" = 'pending_B_A')`;

    const receivedRequests = this.usersRepository.query(sql, [userId]);
    return receivedRequests;
  }

  async getReceivedRequests(userId: string) {
    // const sql = `SELECT * FROM public.User WHERE id IN (SELECT "relatingUserID" FROM Friend where "relatedUserID" = $1 and "state" = 'pending')`;
    const sql = `SELECT * FROM public.User WHERE id IN (SELECT "userB" FROM Friend where "userA" = $1 and "state" = 'pending_B_A') 
    Union
    SELECT * from public.User where id in (select "userA" from Friend where "userB" = $1 and "state" = 'pending_A_B')`;

    const receivedRequests = this.usersRepository.query(sql, [userId]);
    return receivedRequests;
  }

  async getMatchesHistory(userId: string) {
    const sql = `SELECT * FROM public.Games WHERE "firstPlayer" = $1 OR "secondPlayer" = $1`;

    const matchesHistory = await this.usersRepository.query(sql, [userId]);
    // const return_data =[...matchHistory].map(async (match) => {
    //   match.firstPlayer = await this.usersRepository.findOne(match.firstPlayer);
    //   match.secondPlayer = await this.usersRepository.findOne(
    //     match.secondPlayer,
    //   );
    // }
    // });
    // console.log(return_data);
    return matchesHistory;
  }

  async updateProfile(
    currUser: User,
    givenUserName: string,
    imagePath: string,
  ) {
    const foundedUser: User = await this.usersRepository.findOne({
      where: { userName: givenUserName },
    });

    if (foundedUser && foundedUser.id != currUser.id)
      throw new HttpException(
        'UserName is already taken',
        HttpStatus.FORBIDDEN,
      );

    return this.usersRepository.update(currUser.id, {
      userName: givenUserName,
      image: 'http://localhost:5000/users/' + imagePath,
    });
  }

  async setTwoFactorAuthenticationSecret(userId: string, secret: string) {
    return await this.usersRepository.update(userId, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  async turnOnTwoFactorAuthentication(userId: string) {
    console.log(userId);
    return await this.usersRepository.update(
      { id: userId },
      {
        isTwoFactorAuthenticationEnabled: true,
      },
    );
  }

  async turnOffTwoFactorAuthentication(userId: string) {
    return this.usersRepository.update(userId, {
      isTwoFactorAuthenticationEnabled: false,
      twoFactorAuthenticationSecret: null,
    });
  }

  public logOut(@Res() res?: Response) {
    res.clearCookie('access_token');
    res.redirect('http://localhost:3000');
  }

  public async logOutFromAllUsers() {
    console.log('logged out');
    this.usersRepository
      .createQueryBuilder()
      .update()
      .set({ isOnline: false, isPlaying: false })
      .execute();
  }
}
