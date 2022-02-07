import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './roles.decorator';
import { Role } from './entities/role.enum';
import { User } from './entities/user.entity';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.gaurd';

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/admin')
  @Roles(Role.USER)
  createAdmin(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.usersService.createAdmin(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  getUsers(@Query() filterDto: GetUsersFilterDto): Promise<User[]> {
    return this.usersService.getUsers(filterDto);
  }

  @Get('/:id')
  @Roles(Role.ADMIN)
  getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Patch('/:id')
  @Roles(Role.ADMIN)
  updateUserRoleById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUserRoleById(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
