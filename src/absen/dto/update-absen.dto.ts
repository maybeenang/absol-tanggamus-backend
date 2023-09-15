import { PartialType } from '@nestjs/mapped-types';
import { CreateAbsenDto } from './create-absen.dto';
import { Transform, Type } from 'class-transformer';
export class UpdateAbsenDto {
  tanggal?: Date;
  jamMasuk?: Date;
  jamBatas?: Date;
  jamKeluar?: Date;

  @Type(() => Number)
  statusAbsenId?: number;
}
