import { IsNotEmpty } from 'class-validator';
import { AbsenEntity } from '../entities/absen.entity';

export class CreateAbsenDto extends AbsenEntity {
  @IsNotEmpty()
  tanggal: Date;
  @IsNotEmpty()
  jamMasuk: Date;
  @IsNotEmpty()
  jamBatas: Date;
  @IsNotEmpty()
  jamKeluar: Date;
}
