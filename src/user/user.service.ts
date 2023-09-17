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
import { AbsenService } from 'src/absen/absen.service';
import { AbsenStatus } from 'src/absen/enums/absen.enum';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly absenService: AbsenService,
  ) {}

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
        history: {
          include: {
            absen: true,
            statusAbsen: true,
          },
        },
      },
    });
    return users.map((user) => new UserEntity(user));
  }

  async findAllUserAbsen(absenId: string): Promise<any> {
    const user = await this.prisma.user.findMany({
      where: {
        history: {
          some: {
            absenId: absenId,
          },
        },
      },
    });

    return user;
  }

  async absenUser(nip: string): Promise<any> {
    const user = await this.findNip(nip);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const absen = await this.absenService.findAbsenByDate();

    if (!absen) {
      throw new NotFoundException(`Absen not found`);
    }

    const historyUser = await this.prisma.history.findMany({
      where: {
        AND: [
          {
            user: {
              nip: nip,
            },
            absen: {
              id: absen.id,
            },
          },
        ],
      },
    });

    if (historyUser.length > 0) {
      throw new BadRequestException(`Anda sudah absen`);
    }

    const jamAbsen = new Date();
    let statusAbsen = AbsenStatus.BELUMABSEN;

    if (jamAbsen < new Date(absen.jamMasuk)) {
      throw new BadRequestException(`Belum waktunya absen`);
    }

    if (
      jamAbsen > new Date(absen.jamMasuk) &&
      jamAbsen < new Date(absen.jamBatas)
    ) {
      statusAbsen = AbsenStatus.BERHASILABSEN;
    }

    if (
      jamAbsen > new Date(absen.jamBatas) &&
      jamAbsen < new Date(absen.jamKeluar)
    ) {
      statusAbsen = AbsenStatus.TERLAMBAT;
    }

    if (jamAbsen > new Date(absen.jamKeluar)) {
      statusAbsen = AbsenStatus.TIDAKABSEN;
    }

    const history = await this.prisma.history.create({
      data: {
        absen: {
          connect: {
            id: absen.id,
          },
        },
        user: {
          connect: {
            nip: nip,
          },
        },
        jamAbsen: new Date().toISOString(),
        statusAbsen: {
          connect: {
            id: statusAbsen,
          },
        },
      },
    });

    if (!history) {
      throw new InternalServerErrorException(`Failed to absen`);
    }

    return history;
  }
}
