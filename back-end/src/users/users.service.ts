import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm/repository/Repository';
import Friend, { State } from './friend.entity';
import User from './user.entity';
import { Connection } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Friend)
    private readonly friendsRepository: Repository<Friend>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  getUsers() {
    return this.usersRepository.find();
  }

  createUser(createUserDto: any) {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  async findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
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

      this.friendsRepository.insert({
        relatingUserID: relatingUserID,
        relatedUserID: relatedUserID,
        state: State.PENDING,
      });
    }
    return relatedUser;
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
      await this.friendsRepository.update(
        { relatingUserID: relatedUserID, relatedUserID: relatingUserID },
        { state: State.FRIENDS },
      );
      console.log("meow");
    }
    return relatedUser;
  }

  async getFriends(userId: string): Promise<User[]> {
    const sql = `SELECT * FROM public.User WHERE id IN (SELECT "relatedUserID" FROM Friend where "relatingUserID" = $1 and "state" = 'friends') 
    Union
    SELECT * from public.User where id in (select "relatingUserID" from Friend where "relatedUserID" = $1 and "state" = 'friends')`;

    const friends = this.connection.query(sql, [userId]);
    return friends;
  }

  async removeRelation(relatingUserID: string, relatedUserID: string) {
    const relation = await this.friendsRepository.findOne({
      where: [
        { relatingUserID: relatingUserID, relatedUserID: relatedUserID },
        { relatingUserID: relatedUserID, relatedUserID: relatingUserID },
      ],
    });

    if (relation?.state == State.FRIENDS || relation?.state == State.PENDING) {
      this.friendsRepository
        .createQueryBuilder()
        .update({ state: State.NO_RECORD })
        .where([
          {
            relatingUserID: relatingUserID,
            relatedUserID: relatedUserID,
          },
          {
            relateingUserId: relatedUserID,
            relatedUserID: relatingUserID,
          },
        ])
        .returning('*')
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
    const relation = await this.friendsRepository.findOne({
      where: [
        { relatingUserID: relatingUserID, relatedUserID: relatedUserID },
        { relatingUserID: relatedUserID, relatedUserID: relatingUserID },
      ],
    });

    if (
      relation?.state != State.BLOCKED &&
      relation?.state != State.NO_RECORD
    ) {
      this.friendsRepository
        .createQueryBuilder()
        .update({ state: State.BLOCKED })
        .where([
          {
            relatingUserID: relatingUserID,
            relatedUserID: relatedUserID,
          },
        ])
        .returning('*')
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
    const relation = await this.friendsRepository.findOne({
      where: [{ relatingUserID: relatingUserID, relatedUserID: relatedUserID }],
    });

    if (relation?.state == State.BLOCKED) {
      this.friendsRepository
        .createQueryBuilder()
        .update({ state: State.NO_RECORD })
        .where([
          {
            relatingUserID: relatingUserID,
            relatedUserID: relatedUserID,
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
    await this.friendsRepository.find({
      where: [{ relatedUserID: userId, state: State.PENDING }],
    });

    const sql = `SELECT * FROM public.User WHERE id IN (SELECT "relatedUserID" FROM Friend where "relatingUserID" = $1 and "state" = 'pending')`;

    const receivedRequests = this.connection.query(sql, [userId]);
    return receivedRequests;
  }

  async getReceivedRequests(userId: string) {
    const sql = `SELECT * FROM public.User WHERE id IN (SELECT "relatingUserID" FROM Friend where "relatedUserID" = $1 and "state" = 'pending')`;

    const receivedRequests = this.connection.query(sql, [userId]);
    return receivedRequests;
  }
}
