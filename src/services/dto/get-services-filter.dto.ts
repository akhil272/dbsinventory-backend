import { IsOptional, IsString } from 'class-validator';

export class GetServicesFilterDto {
  @IsOptional()
  @IsString()
  search: string;
}
