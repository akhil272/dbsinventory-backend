import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpCode,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { SpeedRatingService } from './speed-rating.service';
import { CreateSpeedRatingDto } from './dto/create-speed-rating.dto';
import { UpdateSpeedRatingDto } from './dto/update-speed-rating.dto';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Role } from 'src/users/entities/role.enum';
import { Roles } from 'src/users/roles.decorator';
import { RolesGuard } from 'src/users/roles.guard';
import { GetSpeedRatingsFilterDto } from './dto/get-speed-ratings-filter.dto';
import { SpeedRating } from './entities/speed-rating.entity';
import { ApiResponse } from 'src/utils/types/common';
import { Response } from 'express';

@Controller('speed-rating')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class SpeedRatingController {
  constructor(private readonly speedRatingService: SpeedRatingService) {}

  @Post()
  create(@Body() createSpeedRatingDto: CreateSpeedRatingDto) {
    return this.speedRatingService.create(createSpeedRatingDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.EMPLOYEE, Role.MANAGER, Role.USER)
  findAll(
    @Query() filterDto: GetSpeedRatingsFilterDto,
  ): Promise<ApiResponse<SpeedRating[]>> {
    return this.speedRatingService.findAll(filterDto);
  }

  @Get('csv')
  @HttpCode(200)
  async getCSVFile(@Res() res: Response) {
    try {
      const csv = await this.speedRatingService.getCSVData();
      res.header('Content-Type', 'text/csv');
      res.attachment('speedRatings.csv');
      return res.send(csv);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch data from system.',
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.speedRatingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSpeedRatingDto: UpdateSpeedRatingDto,
  ) {
    return this.speedRatingService.update(+id, updateSpeedRatingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.speedRatingService.remove(+id);
  }
}
