import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  InternalServerErrorException,
  Query,
  Res,
} from '@nestjs/common';
import { UserQuoteService } from './user-quote.service';
import { CreateUserQuoteDto } from './dto/create-user-quote.dto';
import { UpdateUserQuoteDto } from './dto/update-user-quote.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Role } from 'src/users/entities/role.enum';
import { Roles } from 'src/users/roles.decorator';
import { RolesGuard } from 'src/users/roles.guard';
import { Response } from 'express';
import { GetCsvFileDto } from 'src/users/dto/get-csv-file.dto';

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

  @Get('csv')
  @Roles(Role.ADMIN)
  @HttpCode(200)
  async getCSVFile(
    @Query() getCsvFileDto: GetCsvFileDto,
    @Res() res: Response,
  ) {
    try {
      const csv = await this.userQuoteService.getCSVData(getCsvFileDto);
      res.header('Content-Type', 'text/csv');
      res.attachment('userQuotes.csv');
      res.send(csv);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch data from system.',
      );
    }
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
