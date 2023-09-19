import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { SignInAuthDto } from './dto/signin-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
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

  async validateAdmin(username: string, password: string): Promise<any> {
    const user = await this.userService.findNip(username);
    const admin = await this.userService.checkAdmin(username);

    if (user && admin && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async loginAdmin(signInAuthDto: UserEntity, res: any) {
    const { accessToken, refreshToken } = await this.login(signInAuthDto);

    res.cookie('gatauapaini', refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.send({
      accessToken,
    });
  }

  async login(signInAuthDto: UserEntity) {
    const payload = {
      nip: signInAuthDto.nip,
      sub: {
        id: signInAuthDto.id,
      },
      role: signInAuthDto.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    await this.prismaService.user.update({
      where: {
        id: signInAuthDto.id,
      },
      data: {
        refreshToken: refreshToken,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(signInAuthDto: UserEntity, res: any) {
    await this.prismaService.user.update({
      where: {
        nip: signInAuthDto.nip,
      },
      data: {
        refreshToken: null,
      },
    });

    res.clearCookie('gatauapaini', { httpOnly: true });

    res.send({
      message: 'Logout success',
    });
  }

  async refresh(signInAuthDto: UserEntity, res: any) {
    const user = await this.userService.findNip(signInAuthDto.nip);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const payload = {
      nip: signInAuthDto.nip,
      sub: {
        id: signInAuthDto.id,
      },
      role: signInAuthDto.role,
    };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });

    res.send({
      accessToken,
    });
  }
}
