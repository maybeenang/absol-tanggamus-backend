import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  //   async signIn(credentials: SignAuthDto) {
  //     const user = await this.userService.findOne(credentials.nip);

  //     if (!user) {
  //       throw new UnauthorizedException(`Invalid credentials`);
  //     }
  //   }
}
