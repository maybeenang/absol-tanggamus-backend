import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { SignInAuthDto } from './dto/signin-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateUserDto): Promise<UserEntity> {
    console.log(createAuthDto);
    return await this.userService.create(createAuthDto);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findNip(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(signInAuthDto: UserEntity) {
    const payload = {
      nip: signInAuthDto.nip,
      sub: {
        id: signInAuthDto.id,
      },
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
