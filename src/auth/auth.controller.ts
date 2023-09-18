import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInAuthDto } from './dto/signin-auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtAuthGuard } from './guards/refresh-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { Roles } from './decorators/roles.decorator';
import { LocalAuthMobileGuard } from './guards/local-auth-mobile.guard';

@Controller('v1/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('signup')
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Req() req, @Res() res: Response) {
    return this.authService.loginAdmin(req.user, res);
  }

  @UseGuards(LocalAuthMobileGuard)
  @Post('signin-mobile')
  async loginMobile(@Req() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  async logout(@Req() req, @Res() res: Response) {
    return this.authService.logout(req.user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('refresh-mobile')
  async refreshMobile(@Req() req, @Res() res) {
    return this.authService.refresh(req.user, res);
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Get('refresh')
  async refresh(@Req() req, @Res() res) {
    return this.authService.refresh(req.user, res);
  }
}
