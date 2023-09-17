import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { AbsenService } from './absen.service';
import { AbsenEntity } from './entities/absen.entity';
import { CreateAbsenDto } from './dto/create-absen.dto';
import { UpdateAbsenDto } from './dto/update-absen.dto';
import { ResponseInterceptor } from 'src/response/response.interceptor';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';

@Controller('v1/api/absen')
export class AbsenController {
  constructor(private readonly absenService: AbsenService) {}

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get()
  @UseInterceptors(ClassSerializerInterceptor, ResponseInterceptor)
  async findAll(): Promise<AbsenEntity[]> {
    return await this.absenService.findAll();
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor, ResponseInterceptor)
  async findOne(@Param('id') id: string): Promise<AbsenEntity> {
    return await this.absenService.findOne(id);
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() data: CreateAbsenDto): Promise<AbsenEntity> {
    return await this.absenService.create(data);
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() data: UpdateAbsenDto,
  ): Promise<AbsenEntity> {
    return await this.absenService.update(id, data);
  }

  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.absenService.delete(id);
  }
}
