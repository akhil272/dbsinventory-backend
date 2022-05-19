import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { Stock } from 'src/stocks/stock.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order-dto';
import { Order } from './entities/order.entity';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrdersRepository)
    private ordersRepository: OrdersRepository,
    @InjectRepository(Stock) private stockRepository: Repository<Stock>,
  ) {}

  async addOrder(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const { id, sold_price, quantity, sold_by_user, customer_name } =
      createOrderDto;
    const result = await this.stockRepository.findOne(id);
    if (!result) {
      throw NotFoundError;
    }
    if (quantity > result.quantity) {
      throw new ConflictException('Not enough stock quantity');
    }
    try {
      const order = this.ordersRepository.create({
        quantity,
        sold_by_user,
        sold_price,
        sale_date: new Date(),
        customer_name,
      });

      result.quantity -= quantity;
      order.stock = result;
      if (result.quantity === 0) {
        result.sold_out = true;
      }

      await this.ordersRepository.save(order);
      await this.stockRepository.save(result);
      return order;
    } catch (error) {
      throw new InternalServerErrorException('Failed to add order');
    }
  }

  getOrders(id: number): Promise<Order[]> {
    return this.ordersRepository.getOrders(id);
  }
}
