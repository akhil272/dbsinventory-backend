import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@EntityRepository(Order)
export class OrdersRepository extends Repository<Order> {
  async getOrders(id: number): Promise<Order[]> {
    const query = this.createQueryBuilder('order');
    try {
      const orders = await query
        .where('order.stockId= :stockId', { stockId: id })
        .getMany();
      return orders;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
