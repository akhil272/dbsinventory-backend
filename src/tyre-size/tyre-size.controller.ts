import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TyreSizeService } from './tyre-size.service';
import { CreateTyreSizeDto } from './dto/create-tyre-size.dto';
import { UpdateTyreSizeDto } from './dto/update-tyre-size.dto';

@Controller('tyre-size')
export class TyreSizeController {
  constructor(private readonly tyreSizeService: TyreSizeService) {}

  @Post()
  create(@Body() createTyreSizeDto: CreateTyreSizeDto) {
    return this.tyreSizeService.create(createTyreSizeDto);
  }

  @Get()
  findAll() {
    return this.tyreSizeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tyreSizeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTyreSizeDto: UpdateTyreSizeDto,
  ) {
    return this.tyreSizeService.update(+id, updateTyreSizeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tyreSizeService.remove(+id);
  }
}
