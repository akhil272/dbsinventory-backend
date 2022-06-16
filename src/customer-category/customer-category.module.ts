import { Module } from '@nestjs/common';
import { CustomerCategoryService } from './customer-category.service';
import { CustomerCategoryController } from './customer-category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerCategoryRepository } from './customer-category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerCategoryRepository])],
  controllers: [CustomerCategoryController],
  providers: [CustomerCategoryService],
  exports: [CustomerCategoryService],
})
export class CustomerCategoryModule {}
