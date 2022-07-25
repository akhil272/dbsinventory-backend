import { IsOptional } from 'class-validator';
import { User } from '../entities/user.entity';

export class GetUsersFilterDto {
  @IsOptional()
  search: string;

  @IsOptional()
  role: string;

  @IsOptional()
  take?: number;

  @IsOptional()
  page?: number;
}

export class UsersWithMetaDto {
  users: User[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
