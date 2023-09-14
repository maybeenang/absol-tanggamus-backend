import { Module } from '@nestjs/common';

import { AbsenModule } from './absen/absen.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AbsenModule, UserModule],
})
export class AppModule {}
