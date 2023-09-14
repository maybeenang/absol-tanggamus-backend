import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AbsenService } from './absen.service';
import { AbsenEntity } from './entities/absen.entity';
import { CreateAbsenDto } from './dto/create-absen.dto';

@Controller('v1/api/absen')
export class AbsenController {
  constructor(private readonly absenService: AbsenService) {}

  @Get()
  async findAll(): Promise<AbsenEntity[]> {
    return await this.absenService.findAll();
  }

  @Post()
  async create(@Body() data: CreateAbsenDto): Promise<void> {
    return await this.absenService.create(data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: CreateAbsenDto) {
    return await this.absenService.update(id, data);
  }
}
