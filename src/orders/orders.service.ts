import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parser } from 'json2csv';
import { NotFoundError } from 'rxjs';
import { Stock } from 'src/stocks/entities/stock.entity';
import { User } from 'src/users/entities/user.entity';
import { ApiResponse } from 'src/utils/types/common';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order-dto';
import { ExportFileDto } from './dto/export-file-dto';
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
    const { id, salePrice, quantity, customerName, customerPhoneNumber } =
      createOrderDto;
    const result = await this.stockRepository.findOne(id);
    if (!result) {
      throw NotFoundError;
    }
    if (quantity > result.quantity) {
      throw new ConflictException('Not enough stock quantity');
    }
    const profit = (salePrice - result.cost) * quantity;

    try {
      const order = this.ordersRepository.create({
        quantity,
        employeeName: user.firstName,
        salePrice,
        saleDate: new Date(),
        customerName,
        customerPhoneNumber,
        profit,
      });

      result.quantity -= quantity;
      order.stock = result;
      if (result.quantity === 0) {
        result.soldOut = true;
      }

      await this.ordersRepository.save(order);
      await this.stockRepository.save(result);
      return order;
    } catch (error) {
      throw new InternalServerErrorException('Failed to add order');
    }
  }

  async getOrders(id: number): Promise<ApiResponse<Order[]>> {
    const orders = await this.ordersRepository.getOrders(id);
    return {
      success: true,
      data: orders,
    };
  }

  async export(exportFileDto: ExportFileDto) {
    const parser = new Parser({
      fields: [
        'Order_Id',
        'Sale_Date',
        'Sold_Price',
        'Quantity',
        'Employee_Name',
        'Customer_Name',
        'Customer_Phone_Number',
        'Profit',
        'Stock_ID',
      ],
    });
    const orders = await this.ordersRepository.getExportData(exportFileDto);
    const json = [];
    orders.forEach((order) => {
      json.push({
        Order_Id: order.id,
        Sale_Date: order.saleDate,
        Sold_Price: order.salePrice,
        Quantity: order.quantity,
        Employee_Name: order.employeeName,
        Customer_Name: order.customerName,
        Customer_Phone_Number: order.customerPhoneNumber,
        Profit: order.profit,
        Stock_ID: order.stock,
      });
    });
    const csv = parser.parse(json);
    return csv;
  }
}
