import { Module } from '@nestjs/common';

import { AbsenModule } from './absen/absen.module';

@Module({
  imports: [AbsenModule],
})
export class AppModule {}
