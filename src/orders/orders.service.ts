import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parser } from 'json2csv';
import { CustomersService } from 'src/customers/customers.service';
import { GetOverviewDto } from 'src/manage-quotations/dto/get-overview.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
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
    private customersService: CustomersService,
    private notificationsService: NotificationsService,
    @InjectRepository(Stock) private stockRepository: Repository<Stock>,
  ) {}

  async addOrder(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const { id, salePrice, quantity, firstName, lastName, phoneNumber, email } =
      createOrderDto;
    const stock = await this.stockRepository.findOne(id);
    if (!stock) {
      throw new HttpException('Stock not found', HttpStatus.NOT_FOUND);
    }
    if (quantity > stock.quantity) {
      throw new ConflictException('Not enough stock quantity');
    }
    const profit = (salePrice - stock.cost) * quantity;
    const customer = await this.customersService.findCustomerByPhoneNumber(
      phoneNumber,
    );
    if (!customer) {
      const newCustomer = await this.customersService.createNewCustomer(
        firstName,
        lastName,
        phoneNumber,
        email,
      );
      try {
        const order = this.ordersRepository.create({
          quantity,
          employeeName: user.firstName,
          salePrice,
          saleDate: new Date(),
          customer: newCustomer,
          profit,
        });

        stock.quantity -= quantity;
        order.stock = stock;
        if (stock.quantity === 0) {
          stock.soldOut = true;
        }

        await this.ordersRepository.save(order);
        await this.stockRepository.save(stock);
        this.notificationsService.saleOfStock(user, order);
        return order;
      } catch (error) {
        throw new InternalServerErrorException('Failed to add order');
      }
    }
    try {
      const order = this.ordersRepository.create({
        quantity,
        employeeName: user.firstName,
        salePrice,
        saleDate: new Date(),
        customer,
        profit,
      });

      stock.quantity -= quantity;
      order.stock = stock;
      if (stock.quantity === 0) {
        stock.soldOut = true;
      }

      await this.ordersRepository.save(order);
      await this.stockRepository.save(stock);
      this.notificationsService.saleOfStock(user, order);
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
        'OrderId',
        'SaleDate',
        'SalePrice',
        'Quantity',
        'EmployeeName',
        'Customer',
        'Profit',
        'Stock',
        'CreatedAt',
      ],
    });
    const orders = await this.ordersRepository.getExportData(exportFileDto);
    const json = [];
    orders.forEach((order) => {
      json.push({
        OrderId: order.id,
        SaleDate: order.saleDate,
        SalePrice: order.salePrice,
        Quantity: order.quantity,
        EmployeeName: order.employeeName,
        Customer: order.customer,
        Profit: order.profit,
        Stock: order.stock,
        CreatedAt: order.createdAt,
      });
    });
    const csv = parser.parse(json);
    return csv;
  }

  getTotalSalesAndProfit(getOverviewDto: GetOverviewDto) {
    return this.ordersRepository.getTotalSalesAndProfit(getOverviewDto);
  }

  async remove(id: number) {
    const order = await this.ordersRepository.findOne(id, {
      relations: ['stock'],
    });
    if (!order) throw new NotFoundException('Order ID does not exists');
    const stock = await this.stockRepository.findOne(order.stock.id);
    stock.quantity = stock.quantity + order.quantity;
    try {
      await this.stockRepository.save(stock);
      return this.ordersRepository.delete(id);
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
