import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserQuoteService } from './user-quote.service';
import { CreateUserQuoteDto } from './dto/create-user-quote.dto';
import { UpdateUserQuoteDto } from './dto/update-user-quote.dto';

@Controller('user-quote')
export class UserQuoteController {
  constructor(private readonly userQuoteService: UserQuoteService) {}

  @Post()
  create(@Body() createUserQuoteDto: CreateUserQuoteDto) {
    return this.userQuoteService.create(createUserQuoteDto);
  }

  @Get()
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
