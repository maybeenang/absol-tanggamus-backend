import { Absen, Prisma } from '@prisma/client';

export class AbsenEntity implements Absen {
  id: string;
  tanggal: Date;
  jamMasuk: Date;
  jamBatas: Date;
  jamKeluar: Date;
  createdAt: Date;
  updatedAt: Date;
}
