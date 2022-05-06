import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TyreDetailService } from './tyre-detail.service';
import { CreateTyreDetailDto } from './dto/create-tyre-detail.dto';
import { UpdateTyreDetailDto } from './dto/update-tyre-detail.dto';

@Controller('tyre-detail')
export class TyreDetailController {
  constructor(private readonly tyreDetailService: TyreDetailService) {}

  @Post()
  create(@Body() createTyreDetailDto: CreateTyreDetailDto) {
    return this.tyreDetailService.create(createTyreDetailDto);
  }

  @Get()
  findAll() {
    return this.tyreDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tyreDetailService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTyreDetailDto: UpdateTyreDetailDto,
  ) {
    return this.tyreDetailService.update(+id, updateTyreDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tyreDetailService.remove(+id);
  }
}
