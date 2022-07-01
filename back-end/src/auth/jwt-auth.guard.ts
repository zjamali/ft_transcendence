import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    // handleRequest(err: any, user: any, info: any) {
    //     if (err || !user) {
    //         console.log('user doesn\'t exist, ' + 'error: ' + err);
    //         return null;
    //     }
    //     console.log('user does exist');
    //     console.log(user);
    //     return user;
    // }
    
    // handleRequest(err, user, info) {
    //     // You can throw an exception based on either "info" or "err" arguments
    //     if (err || !user) {
    //         console.log('user doesn\'t exist error : ' + err);
    //       throw err || new UnauthorizedException();
    //     }
    //     return user;
    //   }
}