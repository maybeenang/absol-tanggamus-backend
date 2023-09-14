import { PrismaClient } from '@prisma/client';
import { AbsenStatus } from './absen/enums/absen.enum';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private logger = new Logger('PrismaService');
  async onModuleInit() {
    await this.$connect();

    // initialaize data
    await this.initializeData();
  }

  async initializeData() {
    this.logger.log('Initialize data');
    this.logger.log('Checking status absen field');
    const count = await this.statusAbsen.count();
    if (count < 5) {
      this.logger.log('Status absen field is empty, creating data...');
      await this.statusAbsen.createMany({
        data: [
          {
            id: AbsenStatus.BELUMABSEN,
            keterangan: 'Belum Absen',
          },
          {
            id: AbsenStatus.BERHASILABSEN,
            keterangan: 'Berhasil Absen',
          },
          {
            id: AbsenStatus.TERLAMBAT,
            keterangan: 'Terlambat Absen',
          },
          {
            id: AbsenStatus.TIDAKABSEN,
            keterangan: 'Tidak Absen',
          },
          {
            id: AbsenStatus.IZIN,
            keterangan: 'Izin',
          },
        ],
      });
    }
    this.logger.log('Status absen field is ready');
    this.logger.log('Checking roles field');
    const countRoles: number = await this.roles.count();
    if (countRoles < 2) {
      this.logger.log('Roles field is empty, creating data...');
      await this.roles.createMany({
        data: [
          {
            id: 1,
            role: 'ADMIN',
          },
          {
            id: 2,
            role: 'USER',
          },
        ],
      });
    }
    this.logger.log('Roles field is ready');
    this.logger.log('Data initialization is done');
  }
}
