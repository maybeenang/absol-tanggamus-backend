import {
  Controller,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ResponseInterceptor } from 'src/response/response.interceptor';

@Controller('v1/api/user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @UseInterceptors(ClassSerializerInterceptor, ResponseInterceptor)
  async findAll(): Promise<UserEntity[]> {
    return await this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor, ResponseInterceptor)
  async findAllAdmin(@Req() request) {
    console.log(request.user);
    return await this.userService.getProfile(request.user.nip);
  }
}
