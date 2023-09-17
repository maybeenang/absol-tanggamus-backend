import {
  Controller,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResponseInterceptor } from 'src/response/response.interceptor';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

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

  @UseInterceptors(ClassSerializerInterceptor, ResponseInterceptor)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() request) {
    return await this.userService.getProfile(request.user.nip);
  }

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('absen')
  async getAbsen(@Req() request) {
    return await this.userService.absenUser(request.user.nip);
  }

  @Roles('USER')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('absen-history/:id')
  async getAbsenHistory(@Param('id') id: string) {
    return await this.userService.findAllUserAbsen(id);
  }
}
