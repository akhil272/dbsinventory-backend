import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { LoadIndexService } from './load-index.service';
import { CreateLoadIndexDto } from './dto/create-load-index.dto';
import { UpdateLoadIndexDto } from './dto/update-load-index.dto';
import { GetLoadIndexesFilterDto } from './dto/get-load-indexes-filter.dto';
import { LoadIndex } from './entities/load-index.entity';
import { ApiResponse } from 'src/utils/types/common';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Role } from 'src/users/entities/role.enum';
import { Roles } from 'src/users/roles.decorator';
import { RolesGuard } from 'src/users/roles.guard';

@Controller('load-index')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class LoadIndexController {
  constructor(private readonly loadIndexService: LoadIndexService) {}

  @Post()
  create(@Body() createLoadIndexDto: CreateLoadIndexDto) {
    return this.loadIndexService.create(createLoadIndexDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE, Role.USER)
  findAll(
    @Query() filterDto: GetLoadIndexesFilterDto,
  ): Promise<ApiResponse<LoadIndex[]>> {
    return this.loadIndexService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loadIndexService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLoadIndexDto: UpdateLoadIndexDto,
  ) {
    return this.loadIndexService.update(+id, updateLoadIndexDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loadIndexService.remove(+id);
  }
}
