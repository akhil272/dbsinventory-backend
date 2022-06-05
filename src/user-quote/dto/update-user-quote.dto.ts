import { PartialType } from '@nestjs/mapped-types';
import { CreateUserQuoteDto } from './create-user-quote.dto';

export class UpdateUserQuoteDto extends PartialType(CreateUserQuoteDto) {}
