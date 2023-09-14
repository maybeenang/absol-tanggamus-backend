import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AbsenEntity } from './entities/absen.entity';
import { CreateAbsenDto } from './dto/create-absen.dto';
import { AbsenStatus } from './enums/absen.enum';
import { FilterAbsenDto } from './dto/filter-absen.dto';

@Injectable()
export class AbsenService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<AbsenEntity[]> {
    return this.prisma.absen.findMany();
  }

  async findFilter(filterAbsenDto: FilterAbsenDto): Promise<AbsenEntity[]> {
    const { status } = filterAbsenDto;

    return this.prisma.absen.findMany({
      where: {
        statusAbsenId: parseInt(status),
      },
    });
  }

  async findOne(id: string): Promise<AbsenEntity> {
    try {
      const foundAbsen = await this.prisma.absen.findUnique({ where: { id } });
      if (!foundAbsen) {
        throw new NotFoundException(`Absen not found`);
      }
      return foundAbsen;
    } catch (error) {
      throw new NotFoundException(`Absen not found`);
    }
  }

  async create(data: CreateAbsenDto): Promise<void> {
    const { tanggal, jamMasuk, jamBatas, jamKeluar } = data;
    await this.prisma.absen.create({
      data: {
        tanggal: new Date(tanggal).toISOString(),
        jamMasuk: new Date(`${tanggal}:${jamMasuk}`).toISOString(),
        jamBatas: new Date(`${tanggal}:${jamBatas}`).toISOString(),
        jamKeluar: new Date(`${tanggal}:${jamKeluar}`).toISOString(),
        statusAbsenId: AbsenStatus.BERHASILABSEN,
      },
    });
  }

  async update(id: string, data: CreateAbsenDto): Promise<void> {
    const { tanggal, jamMasuk, jamBatas, jamKeluar } = data;

    await this.findOne(id);

    await this.prisma.absen.update({
      where: { id },
      data: {
        tanggal: new Date(tanggal).toISOString(),
        jamMasuk: new Date(`${tanggal}:${jamMasuk}`).toISOString(),
        jamBatas: new Date(`${tanggal}:${jamBatas}`).toISOString(),
        jamKeluar: new Date(`${tanggal}:${jamKeluar}`).toISOString(),
      },
    });
  }

  async delete(id: string, data: CreateAbsenDto): Promise<void> {
    const { tanggal, jamMasuk, jamBatas, jamKeluar } = data;
    await this.prisma.absen.update({
      where: { id },
      data: {
        tanggal: new Date(tanggal).toISOString(),
        jamMasuk: new Date(`${tanggal}:${jamMasuk}`).toISOString(),
        jamBatas: new Date(`${tanggal}:${jamBatas}`).toISOString(),
        jamKeluar: new Date(`${tanggal}:${jamKeluar}`).toISOString(),
      },
    });
  }
}
