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

  async login(signInAuthDto: UserEntity, res: any) {
    const payload = {
      username: signInAuthDto.nip,
      sub: {
        id: signInAuthDto.id,
      },
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    res.cookie('gatauapaini', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.send({
      accessToken,
    });
  }

  async refresh(signInAuthDto: UserEntity, res: any) {
    const payload = {
      username: signInAuthDto.nip,
      sub: {
        id: signInAuthDto.id,
      },
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });

    res.send({
      accessToken,
    });
  }
}
