import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    return this.usersRepository.findOne(id);
  }

  async addFriend() {
    // const friend: Friend = new Friend();
    // friend.firstId = '39669';
    // friend.secondId = '62225';
    // const user: User = await this.findOne('62225');
    // friend.state = State.FRIENDS;
    // user.friends = [];
    // user.friends.push(friend);
    // this.usersRepository.save(user);

    // const firstUserId = '39669';
    // const secondUserId = '62225';

    // const id1 =
    //   parseInt(firstUserId) > parseInt(secondUserId)
    //     ? secondUserId
    //     : firstUserId;

    // const id2 =
    //   parseInt(secondUserId) > parseInt(firstUserId)
    //     ? firstUserId
    //     : secondUserId;

    // const friends = await this.friendsRepository.find({
    //   where: [
    //     {
    //       firstId: firstUserId,
    //       secondId: secondUserId,
    //       state: State.FRIENDS,
    //     },
    //     {
    //       firstId: secondUserId,
    //       secondId: firstUserId,
    //       state: State.FRIENDS,
    //     },
    //   ],
    // });

    // console.log(friends);
  }
}
