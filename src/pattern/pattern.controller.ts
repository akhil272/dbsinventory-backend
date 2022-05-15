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
import { PatternService } from './pattern.service';
import { CreatePatternDto } from './dto/create-pattern.dto';
import { UpdatePatternDto } from './dto/update-pattern.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Role } from 'src/users/entities/role.enum';
import { Roles } from 'src/users/roles.decorator';
import { RolesGuard } from 'src/users/roles.gaurd';

@Controller('pattern')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class PatternController {
  constructor(private readonly patternService: PatternService) {}

  @Post()
  create(@Body() createPatternDto: CreatePatternDto) {
    return this.patternService.create(createPatternDto);
  }

  @Get()
  findAll() {
    return this.patternService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patternService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatternDto: UpdatePatternDto) {
    return this.patternService.update(+id, updatePatternDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patternService.remove(+id);
  }
}
