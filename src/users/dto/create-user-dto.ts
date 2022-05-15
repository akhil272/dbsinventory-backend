import { IsEnum, IsOptional } from 'class-validator';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { Role } from '../entities/role.enum';

export class CreateUserDto extends RegisterUserDto {
  @IsEnum(Role)
  @IsOptional()
  roles: Role;
}
