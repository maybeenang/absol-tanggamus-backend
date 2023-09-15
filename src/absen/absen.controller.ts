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
import { FilterAbsenDto } from './dto/filter-absen.dto';
import { UpdateAbsenDto } from './dto/update-absen.dto';
import { ResponseInterceptor } from 'src/response/response.interceptor';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('v1/api/absen')
export class AbsenController {
  constructor(private readonly absenService: AbsenService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @UseInterceptors(ClassSerializerInterceptor, ResponseInterceptor)
  async findAll(@Query() filterAbsen: FilterAbsenDto): Promise<AbsenEntity[]> {
    if (Object.keys(filterAbsen).length) {
      return await this.absenService.findFilter(filterAbsen);
    }
    return await this.absenService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor, ResponseInterceptor)
  async findOne(@Param('id') id: string): Promise<AbsenEntity> {
    return await this.absenService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() data: CreateAbsenDto): Promise<AbsenEntity> {
    return await this.absenService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id') id: string,
    @Body() data: UpdateAbsenDto,
  ): Promise<AbsenEntity> {
    return await this.absenService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.absenService.delete(id);
  }
}
