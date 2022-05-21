import { IsOptional, IsString } from 'class-validator';

export class GetVendorsFilterDto {
  @IsOptional()
  @IsString()
  search: string;
}
