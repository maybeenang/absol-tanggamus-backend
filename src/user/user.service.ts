import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { RolesEnum } from './enums/roles.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<any> {
    if (await this.findNip(data.nip)) {
      throw new BadRequestException(`NIP already exist`);
    }

    if (await this.findEmail(data.email)) {
      throw new BadRequestException(`Email already exist`);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const user = await this.prisma.user.create({
      data: {
        ...data,
        role: {
          connect: {
            role: RolesEnum.USER,
          },
        },
      },
    });
    if (!user) {
      throw new InternalServerErrorException(`Failed to create user`);
    }

    return user;
  }

  async addAdmin(user: UserEntity): Promise<UserEntity> {
    const admin = await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        role: {
          connect: {
            role: RolesEnum.ADMIN,
          },
        },
      },
    });
    if (!admin) {
      throw new InternalServerErrorException(`Failed to add admin`);
    }

    return admin;
  }

  async findOne(id: string): Promise<UserEntity> {
    const foundUser = await this.prisma.user.findUnique({ where: { id } });
    if (!foundUser) {
      throw new NotFoundException(`User not found`);
    }
    return foundUser;
  }

  async getProfile(nip: string): Promise<UserEntity> {
    const foundUser = await this.prisma.user.findUnique({
      where: { nip },
      include: {
        role: {
          select: {
            role: true,
          },
        },
      },
    });
    if (!foundUser) {
      throw new NotFoundException(`User not found`);
    }
    return new UserEntity(foundUser);
  }

  async findNip(nip: string): Promise<UserEntity> {
    const foundUser = await this.prisma.user.findUnique({
      where: { nip },
      include: {
        role: {
          select: {
            role: true,
          },
        },
      },
    });
    return foundUser;
  }

  async findEmail(email: string): Promise<UserEntity> {
    const foundUser = await this.prisma.user.findUnique({ where: { email } });
    return foundUser;
  }

  async findAll(): Promise<UserEntity[]> {
    const users: UserEntity[] = await this.prisma.user.findMany({
      include: {
        role: {
          select: {
            role: true,
          },
        },
      },
    });

    return users.map((user) => new UserEntity(user));
  }
}
