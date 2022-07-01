import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from "@nestjs/common";
import User from 'src/users/user.entity';


type JwtPayload = { id: string; username: string };

@Injectable()
export class JwtAuthService {
    constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) {}

    async validateUser(payload: JwtPayload): Promise<User> {
        const { id } = payload;
        try {
            const user = await this.usersService.findOne(id);
            if (!user) {
                return null;
            }
            return user;
        } catch {
            return null;
        }
    }

    login(user) {
        console.log('user from login in JwtAuthService: ');
        console.log(user);
        const payload: JwtPayload = {username: user.userName, id: user.id};
        console.log('payload:');
        console.log(payload);
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}