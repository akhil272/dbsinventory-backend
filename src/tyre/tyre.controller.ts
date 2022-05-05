import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TyreService } from './tyre.service';
import { CreateTyreDto } from './dto/create-tyre.dto';
import { UpdateTyreDto } from './dto/update-tyre.dto';

@Controller('tyre')
export class TyreController {
  constructor(private readonly tyreService: TyreService) {}

  @Post()
  async create(@Body() createTyreDto: CreateTyreDto) {
    return this.tyreService.create(createTyreDto);
  }

  @Get()
  findAll() {
    return this.tyreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tyreService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTyreDto: UpdateTyreDto) {
    return this.tyreService.update(+id, updateTyreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tyreService.remove(+id);
  }
}
