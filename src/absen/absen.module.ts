import { Module } from '@nestjs/common';
import { AbsenService } from './absen.service';
import { AbsenController } from './absen.controller';
import { PrismaService } from 'src/prisma.service';
import { JwtStrategy } from 'src/auth/strategies/jwt-strategy';

@Module({
  controllers: [AbsenController],
  providers: [AbsenService, PrismaService, JwtStrategy],
  exports: [AbsenService],
})
export class AbsenModule {}
