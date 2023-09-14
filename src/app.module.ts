import { Module } from '@nestjs/common';

import { AbsenModule } from './absen/absen.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), AbsenModule, AuthModule, UserModule],
})
export class AppModule {}
