import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'prisma/prisma.service';
import { JwtStrategy } from 'src/auth/strategies/jwt-strategy';
import { AbsenService } from 'src/absen/absen.service';

@Module({
  controllers: [UserController],
  providers: [UserService, AbsenService, PrismaService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
