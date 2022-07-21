import { InternalServerErrorException } from '@nestjs/common';
import { GetOverviewDto } from 'src/manage-quotations/dto/get-overview.dto';
import { GetCsvFileDto } from 'src/users/dto/get-csv-file.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@EntityRepository(Order)
export class OrdersRepository extends Repository<Order> {
  async getOrders(id: number): Promise<Order[]> {
    const query = this.createQueryBuilder('order');
    try {
      const orders = await query
        .select([
          'order.id',
          'order.saleDate',
          'order.salePrice',
          'order.quantity',
          'order.profit',
          'order.employeeName',
          'order.customer',
          'user.firstName',
          'user.lastName',
        ])
        .leftJoinAndSelect('order.customer', 'customer')
        .leftJoin('customer.user', 'user')
        .where('order.stockId= :stockId', { stockId: id })
        .getMany();
      return orders;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getCSVData(getCsvFileDto: GetCsvFileDto) {
    const query = this.createQueryBuilder('order');
    const start = new Date(getCsvFileDto.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(getCsvFileDto.endDate);
    end.setHours(24, 0, 0, 0);
    try {
      const orders = await query
        .where('order.saleDate >= :start', { start })
        .andWhere('order.saleDate <= :end', { end })
        .loadAllRelationIds()
        .getMany();
      return orders;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getTotalSalesAndProfit(getOverviewDto: GetOverviewDto) {
    const query = this.createQueryBuilder('order');
    const start = new Date(getOverviewDto.startDate);
    const end = new Date(getOverviewDto.endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(24, 0, 0, 0);

    const { totalSales } = await query
      .where('order.createdAt >= :start', { start })
      .andWhere('order.createdAt <= :end', { end })
      .select('SUM(order.salePrice)', 'totalSales')
      .getRawOne();
    const { profit } = await query
      .select('SUM(order.profit)', 'profit')
      .getRawOne();
    return [totalSales, profit];
  }
}
