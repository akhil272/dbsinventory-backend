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
import { UserQuoteService } from './user-quote.service';
import { CreateUserQuoteDto } from './dto/create-user-quote.dto';
import { UpdateUserQuoteDto } from './dto/update-user-quote.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Role } from 'src/users/entities/role.enum';
import { Roles } from 'src/users/roles.decorator';
import { RolesGuard } from 'src/users/roles.guard';

@Controller('user-quote')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class UserQuoteController {
  constructor(private readonly userQuoteService: UserQuoteService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER, Role.EMPLOYEE)
  create(@Body() createUserQuoteDto: CreateUserQuoteDto) {
    return this.userQuoteService.create(createUserQuoteDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.MANAGER, Role.USER, Role.EMPLOYEE)
  findAll() {
    return this.userQuoteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userQuoteService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserQuoteDto: UpdateUserQuoteDto,
  ) {
    return this.userQuoteService.update(+id, updateUserQuoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userQuoteService.remove(+id);
  }
}
