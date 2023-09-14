import { statusAbsen, Prisma } from '@prisma/client';

export class AbsenStatusEntity implements statusAbsen {
  id: number;
  keterangan: string;
  createdAt: Date;
  updatedAt: Date;
}
