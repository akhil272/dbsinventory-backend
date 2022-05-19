import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TyreDetailService } from './tyre-detail.service';
import { CreateTyreDetailDto } from './dto/create-tyre-detail.dto';
import { UpdateTyreDetailDto } from './dto/update-tyre-detail.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Role } from 'src/users/entities/role.enum';
import { Roles } from 'src/users/roles.decorator';
import { RolesGuard } from 'src/users/roles.guard';
import { GetTyreDetailsFilterDto } from './dto/get-tyre-detail-filter.dto';
import { TyreDetail } from './entities/tyre-detail.entity';
import { ApiResponse } from 'src/utils/types/common';

@Controller('tyre-detail')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class TyreDetailController {
  constructor(private readonly tyreDetailService: TyreDetailService) {}

  @Post()
  create(@Body() createTyreDetailDto: CreateTyreDetailDto) {
    return this.tyreDetailService.create(createTyreDetailDto);
  }

  @Get()
  findAll(
    @Query() filterDto: GetTyreDetailsFilterDto,
  ): Promise<ApiResponse<TyreDetail[]>> {
    return this.tyreDetailService.findAll(filterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tyreDetailService.findOne(+id);
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
