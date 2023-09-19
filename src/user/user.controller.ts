import {
  Controller,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Req,
  Param,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResponseInterceptor } from 'src/response/response.interceptor';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { FilterHistoryDateDto } from 'src/absen/dto/filter-history-date.dto';

@Controller('v1/api/user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  @UseInterceptors(ClassSerializerInterceptor, ResponseInterceptor)
  async findAll(): Promise<UserEntity[]> {
    return await this.userService.findAll();
  }

  @Delete('hapus-user/:id')
  async deleteUser(@Param('id') id: string): Promise<UserEntity[]> {
    return await this.userService.delete(id);
  }

  @UseInterceptors(ClassSerializerInterceptor, ResponseInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() request) {
    return await this.userService.getProfile(request.user.nip);
  }

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('absen-today')
  async getAbsenToday(@Req() request) {
    return await this.userService.getAbsenToday(request.user.nip);
  }

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('absen-masuk/:id')
  async getAbsen(@Param('id') idAbsen: string, @Req() request) {
    return await this.userService.absenUser(idAbsen, request.user.nip);
  }

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('absen-history/:date')
  async getHitorybyDate(@Param('date') dateAbsen: string, @Req() request) {
    return await this.userService.historyUser(dateAbsen, request.user.nip);
  }
}
