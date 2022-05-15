import { IsNotEmpty } from 'class-validator';

export class GenerateOtpDto {
  @IsNotEmpty()
  phone_number: string;
}
