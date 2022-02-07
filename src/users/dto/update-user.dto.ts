import { IsEnum } from 'class-validator';
import { Role } from '../entities/role.enum';

export class UpdateUserDto {
  @IsEnum(Role)
  roles: Role;
}
