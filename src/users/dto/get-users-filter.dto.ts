import { IsOptional } from 'class-validator';

export class GetUsersFilterDto {
  @IsOptional()
  search: string;
}
