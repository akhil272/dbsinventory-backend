import { PartialType } from '@nestjs/mapped-types';
import { CreateTyreDetailDto } from './create-tyre-detail.dto';

export class UpdateTyreDetailDto extends PartialType(CreateTyreDetailDto) {}
