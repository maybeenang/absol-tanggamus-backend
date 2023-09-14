import { BadRequestException, PipeTransform } from '@nestjs/common';
import { AbsenStatus } from '../enums/absen.enum';

export class AbsenStatusValidator implements PipeTransform {
  readonly allowedStatuses = [
    AbsenStatus.BELUMABSEN,
    AbsenStatus.BERHASILABSEN,
    AbsenStatus.TERLAMBAT,
    AbsenStatus.TIDAKABSEN,
    AbsenStatus.IZIN,
  ];

  transform(value: any) {
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status`);
    }

    return value;
  }
  isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);

    return idx !== -1;
  }
}
