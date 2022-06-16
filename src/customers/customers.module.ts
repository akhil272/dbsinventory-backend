import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersRepository } from './customers.repository';
import { CustomerCategoryModule } from 'src/customer-category/customer-category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomersRepository]),
    CustomerCategoryModule,
  ],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
})
export class CustomersModule {}
