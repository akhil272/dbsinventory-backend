import { IsOptional, IsString } from 'class-validator';

export class GetTransportsFilterDto {
  @IsOptional()
  @IsString()
  search: string;
}
