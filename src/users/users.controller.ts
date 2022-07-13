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
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './roles.decorator';
import { Role } from './entities/role.enum';
import { User } from './entities/user.entity';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { RolesGuard } from './roles.guard';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import RequestWithUser from 'src/auth/request-with-user.interface';
import { GetUser } from 'src/auth/get-user.decorator';
import { ApiResponse } from 'src/utils/types/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import { Express } from 'express';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Controller('users')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.ADMIN)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  createAdmin(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  getUsers(
    @Query() filterDto: GetUsersFilterDto,
  ): Promise<ApiResponse<User[]>> {
    return this.usersService.getUsers(filterDto);
  }

  @Get('/:id')
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.MANAGER, Role.USER)
  getUserById(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.MANAGER, Role.USER)
  updateUserProfile(
    @Param('id') id: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.usersService.updateUserProfile(+id, updateUserProfileDto);
  }

  @Patch('role/:id')
  @Roles(Role.ADMIN)
  updateUserRoleById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUserRoleById(+id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.usersService.deleteUser(+id);
  }

  @Get('user/info')
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.MANAGER, Role.USER)
  getMe(@GetUser() user: User): {
    id: number;
    firstName: string;
    lastName: string | undefined;
    phoneNumber: string;
    email: string;
    role: string;
  } {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: user.role,
    };
  }

  @Get('avatars/:id')
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.MANAGER, Role.USER)
  async getAvatar(@Param('id') id: string) {
    const file = await this.usersService.getFilePath(+id);
    return { fileName: file.path.slice(14) };
  }

  @Post('avatar')
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.MANAGER, Role.USER)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploadedFiles/avatars',
        filename: (request, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async addAvatars(
    @Req() request: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.usersService.addAvatar(request.user.id, {
      path: file.path,
      filename: file.originalname,
      mimetype: file.mimetype,
    });
    return {
      url: file.path,
    };
  }

  @Get('avatars/:path')
  async getImage(@Param('path') path: string, @Res() res: Response) {
    res.sendFile(path, { root: './uploadedFiles/avatars' });
  }

  @Get('overview/:id')
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.MANAGER, Role.USER)
  getOverView(@Param('id') id: string) {
    return this.usersService.getOverView(+id);
  }
}
