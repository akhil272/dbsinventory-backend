import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { GetUser } from 'src/auth/get-user.decorator';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { GetCsvFileDto } from 'src/users/dto/get-csv-file.dto';
import { Role } from 'src/users/entities/role.enum';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/users/roles.decorator';
import { RolesGuard } from 'src/users/roles.guard';
import { ApiResponse } from 'src/utils/types/common';
import { CreateOrderDto } from './dto/create-order-dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  createStock(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User,
  ): Promise<Order> {
    return this.ordersService.addOrder(createOrderDto, user);
  }

  @Get('csv')
  @Roles(Role.ADMIN)
  @HttpCode(200)
  async getCSVFile(
    @Query() getCsvFileDto: GetCsvFileDto,
    @Res() res: Response,
  ) {
    try {
      const csv = await this.ordersService.getCSVData(getCsvFileDto);
      res.header('Content-Type', 'text/csv');
      res.attachment('users.csv');
      res.send(csv);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch data from system.',
      );
    }
  }

  //get all orders of specific stock item passed by StockId
  @Get('/:id')
  @Roles(Role.ADMIN)
  getAllOrders(@Param('id') id: string): Promise<ApiResponse<Order[]>> {
    return this.ordersService.getOrders(+id);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(200)
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
