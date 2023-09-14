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
} from '@nestjs/common';
import { AbsenService } from './absen.service';
import { AbsenEntity } from './entities/absen.entity';
import { CreateAbsenDto } from './dto/create-absen.dto';
import { FilterAbsenDto } from './dto/filter-absen.dto';
import { UpdateAbsenDto } from './dto/update-absen.dto';
import { ResponseInterceptor } from 'src/response/response.interceptor';

@Controller('v1/api/absen')
@UseInterceptors(ResponseInterceptor)
@UseInterceptors(ClassSerializerInterceptor)
export class AbsenController {
  constructor(private readonly absenService: AbsenService) {}

  @Get()
  async findAll(@Query() filterAbsen: FilterAbsenDto): Promise<AbsenEntity[]> {
    if (Object.keys(filterAbsen).length) {
      return await this.absenService.findFilter(filterAbsen);
    }
    return await this.absenService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<AbsenEntity> {
    return await this.absenService.findOne(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() data: CreateAbsenDto): Promise<AbsenEntity> {
    return await this.absenService.create(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateAbsenDto,
  ): Promise<AbsenEntity> {
    return await this.absenService.update(id, data);
  }
}
