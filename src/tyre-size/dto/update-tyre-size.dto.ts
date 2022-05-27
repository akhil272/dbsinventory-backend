import { PartialType } from '@nestjs/mapped-types';
import { CreateTyreSizeDto } from './create-tyre-size.dto';

export class UpdateTyreSizeDto extends PartialType(CreateTyreSizeDto) {}
