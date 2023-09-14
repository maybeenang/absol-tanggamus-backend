import { AbsenEntity } from '../entities/absen.entity';

export class CreateAbsenDto extends AbsenEntity {
  tanggal: Date;
  jamMasuk: Date;
  jamBatas: Date;
  jamKeluar: Date;
}
