import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { RolesEnum } from './enums/roles.enum';
import * as bcrypt from 'bcrypt';
import { AbsenService } from 'src/absen/absen.service';
import { AbsenStatus } from 'src/absen/enums/absen.enum';
import { FilterHistoryDateDto } from 'src/absen/dto/filter-history-date.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly absenService: AbsenService,
  ) {}

  private readonly logger = new Logger(UserService.name);

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

    if (data.role === RolesEnum.ADMIN) {
      await this.addAdmin(user);
    }

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

  async checkAdmin(nip: string): Promise<boolean> {
    const admin = await this.prisma.user.findFirst({
      where: {
        AND: [
          {
            nip,
          },
          {
            role: {
              some: {
                role: RolesEnum.ADMIN,
              },
            },
          },
        ],
      },
    });

    if (!admin) {
      return false;
    }

    return true;
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
      orderBy: {
        createdAt: 'desc',
      },
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

  async getAbsenToday(nip: string): Promise<any> {
    // get today

    const absen = await this.prisma.history.findFirst({
      where: {
        AND: [
          {
            userNip: nip,
          },
          {
            absen: {
              jamKeluar: {
                gte: new Date().toISOString(),
              },
            },
          },
        ],
      },
      include: {
        absen: true,
        statusAbsen: true,
      },
      orderBy: {
        absen: {
          tanggal: 'desc',
        },
      },
    });

    if (!absen) {
      throw new NotFoundException(`tidak ada absen`);
    }

    return absen;
  }

  async absenUser(idAbsen: string, nip: string): Promise<any> {
    const absen = await this.absenService.findOne(idAbsen);

    const historyUser = await this.prisma.history.findFirst({
      where: {
        AND: [
          {
            absenId: idAbsen,
          },
          {
            userNip: nip,
          },
          {
            statusAbsenId: AbsenStatus.BELUMABSEN,
          },
          {
            jamAbsen: null,
          },
        ],
      },
    });

    if (!historyUser) {
      throw new BadRequestException(`Anda sudah absen`);
    }

    const jamAbsen = new Date();
    let statusAbsen = AbsenStatus.BELUMABSEN;

    if (jamAbsen < absen.jamMasuk) {
      throw new BadRequestException(`Belum waktunya absen`);
    }
    if (
      jamAbsen >= new Date(absen.jamMasuk) &&
      jamAbsen < new Date(absen.jamBatas)
    ) {
      statusAbsen = AbsenStatus.BERHASILABSEN;
    }
    if (
      jamAbsen >= new Date(absen.jamBatas) &&
      jamAbsen < new Date(absen.jamKeluar)
    ) {
      statusAbsen = AbsenStatus.TERLAMBAT;
    }
    if (jamAbsen >= new Date(absen.jamKeluar)) {
      statusAbsen = AbsenStatus.TIDAKABSEN;
    }

    const history = await this.prisma.history.update({
      where: {
        id: historyUser.id,
      },
      data: {
        statusAbsenId: statusAbsen,
        jamAbsen: jamAbsen.toISOString(),
      },
    });

    if (!history) {
      throw new InternalServerErrorException(`Failed to absen`);
    }

    return {
      message: 'Absen Berhasil',
      statusAbsen: statusAbsen,
    };
  }
  async historyUser(dateAbsen: string, nip: string): Promise<any> {
    const dateConvert = new Date(dateAbsen).toISOString();

    const historyUser = await this.prisma.history.findFirst({
      where: {
        AND: [
          {
            userNip: nip,
          },
          {
            absen: {
              jamKeluar: {
                gte: dateConvert,
              },
            },
          },
        ],
      },
      include: {
        absen: true,
        statusAbsen: true,
      },
      orderBy: {
        absen: {
          tanggal: 'desc',
        },
      },
    });

    if (!historyUser) {
      throw new NotFoundException(`tidak ada absen`);
    }

    return historyUser;
  }
}
