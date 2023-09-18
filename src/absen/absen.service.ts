import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AbsenEntity } from './entities/absen.entity';
import { CreateAbsenDto } from './dto/create-absen.dto';
import { UpdateAbsenDto } from './dto/update-absen.dto';
import { AbsenStatusEntity } from './entities/absen-status.entiry';
import { AbsenStatus } from './enums/absen.enum';

@Injectable()
export class AbsenService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AbsenEntity[]> {
    return this.prisma.absen.findMany({
      orderBy: {
        tanggal: 'desc',
      },
    });
  }

  async findAbsenStatus(status: number): Promise<AbsenStatusEntity> {
    const foundStatus = await this.prisma.statusAbsen.findUnique({
      where: {
        id: status,
      },
    });

    if (!foundStatus) {
      throw new BadRequestException(`Status absen not valid`);
    }

    return foundStatus;
  }

  async findOne(id: string): Promise<AbsenEntity> {
    try {
      const foundAbsen = await this.prisma.absen.findUnique({
        where: { id },
        include: {
          history: {
            include: {
              statusAbsen: {
                select: {
                  keterangan: true,
                  id: true,
                },
              },
              user: {
                select: {
                  id: true,
                  nama: true,
                  nip: true,
                },
              },
            },
          },
        },
      });
      if (!foundAbsen) {
        throw new NotFoundException(`Absen tidak ditemukan`);
      }
      return foundAbsen;
    } catch (error) {
      throw new NotFoundException(`Absen not found`);
    }
  }

  async create(data: CreateAbsenDto): Promise<AbsenEntity> {
    const { tanggal, jamMasuk, jamBatas, jamKeluar } = data;

    // filter absen by tanggal
    const foundAbsen = await this.prisma.absen.findMany({
      where: {
        tanggal: new Date(tanggal).toISOString(),
      },
    });

    if (foundAbsen.length > 0) {
      throw new BadRequestException(`Absen sudah ada untuk tanggal ini`);
    }

    console.log(jamMasuk);

    const users = await this.prisma.user.findMany({
      select: {
        nip: true,
      },
    });

    return await this.prisma.absen.create({
      data: {
        tanggal: new Date(tanggal).toISOString(),
        jamMasuk: new Date(jamMasuk).toISOString(),
        jamBatas: new Date(jamBatas).toISOString(),
        jamKeluar: new Date(jamKeluar).toISOString(),
        history: {
          createMany: {
            data: users.map((user) => ({
              statusAbsenId: AbsenStatus.BELUMABSEN,
              userNip: user.nip,
            })),
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateAbsenDto): Promise<AbsenEntity> {
    const { tanggal, jamMasuk, jamBatas, jamKeluar } = data;

    await this.findOne(id);

    return await this.prisma.absen.update({
      where: { id },
      data: {
        tanggal: new Date(tanggal).toISOString(),
        jamMasuk: new Date(`${tanggal}:${jamMasuk}`).toISOString(),
        jamBatas: new Date(`${tanggal}:${jamBatas}`).toISOString(),
        jamKeluar: new Date(`${tanggal}:${jamKeluar}`).toISOString(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.absen.delete({
      where: { id },
      include: {
        history: {
          where: {
            absenId: id,
          },
        },
      },
    });
  }

  async findAbsenByDate(): Promise<AbsenEntity> {
    let today = new Date().toISOString();

    today = today.slice(0, 10);

    const absen = await this.prisma.absen.findFirst({
      where: {
        tanggal: new Date(today).toISOString(),
      },
    });

    if (!absen) {
      throw new NotFoundException(`Tidak ada absen hari ini`);
    }

    return absen;
  }
}
