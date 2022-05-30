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
    const { id, sold_price, quantity, customer_name, customer_phone_number } =
      createOrderDto;
    const result = await this.stockRepository.findOne(id);
    if (!result) {
      throw NotFoundError;
    }
    if (quantity > result.quantity) {
      throw new ConflictException('Not enough stock quantity');
    }
    const profit = (sold_price - result.cost) * quantity;

    try {
      const order = this.ordersRepository.create({
        quantity,
        employee_name: user.first_name,
        sold_price,
        sale_date: new Date(),
        customer_name,
        customer_phone_number,
        profit,
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
        'ID',
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
        ID: order.id,
        Sale_Date: order.sale_date,
        Sold_Price: order.sold_price,
        Quantity: order.quantity,
        Employee_Name: order.employee_name,
        Customer_Name: order.customer_name,
        Customer_Phone_Number: order.customer_phone_number,
        Profit: order.profit,
        Stock_ID: order.stock,
      });
    });
    const csv = parser.parse(json);
    return csv;
  }
}
