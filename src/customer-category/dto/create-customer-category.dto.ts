import { IsString } from 'class-validator';

export class CreateCustomerCategoryDto {
  @IsString()
  name: string;
}
