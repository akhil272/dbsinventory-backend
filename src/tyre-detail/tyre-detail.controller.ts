import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TyreDetailService } from './tyre-detail.service';
import { CreateTyreDetailDto } from './dto/create-tyre-detail.dto';
import { UpdateTyreDetailDto } from './dto/update-tyre-detail.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Role } from 'src/users/entities/role.enum';
import { Roles } from 'src/users/roles.decorator';
import { RolesGuard } from 'src/users/roles.guard';

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
    return this.tyreDetailService.update(id, updateTyreDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tyreDetailService.remove(id);
  }
}
