import { PartialType } from '@nestjs/mapped-types';
import { CreateLoadIndexDto } from './create-load-index.dto';

export class UpdateLoadIndexDto extends PartialType(CreateLoadIndexDto) {}
