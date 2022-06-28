import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
