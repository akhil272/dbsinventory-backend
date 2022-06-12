import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ExportFileDto } from './dto/export-file-dto';
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

  async getExportData(exportFileDto: ExportFileDto) {
    const query = this.createQueryBuilder('order');
    const start = new Date(exportFileDto.startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(exportFileDto.endDate);
    end.setHours(24, 0, 0, 0);
    try {
      const orders = await query
        .where('order.saleDate >= :start', { start })
        .andWhere('order.saleDate <= :end', { end })
        .loadAllRelationIds()
        .getMany();
      return orders;
    } catch (error) {}
  }
}
