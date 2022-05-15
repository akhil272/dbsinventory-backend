import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/get-user.decorator';
import JwtAuthenticationGuard from 'src/auth/jwt-authentication.guard';
import { Role } from 'src/users/entities/role.enum';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/users/roles.decorator';
import { RolesGuard } from 'src/users/roles.gaurd';
import { CreateOrderDto } from './dto/create-order-dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthenticationGuard, RolesGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Roles(Role.ADMIN, Role.MANAGER, Role.EMPLOYEE)
  @Post()
  createStock(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser() user: User,
  ): Promise<Order> {
    return this.ordersService.addOrder(createOrderDto, user);
  }

  //get all orders of specific stock item passed by stockid
  @Roles(Role.ADMIN)
  @Get('/:id')
  getAllOrders(@Param('id') id: string): Promise<Order[]> {
    return this.ordersService.getOrders(id);
  }
}
