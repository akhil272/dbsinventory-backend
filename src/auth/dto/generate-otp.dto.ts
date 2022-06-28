import { IsNotEmpty } from 'class-validator';

export class GenerateOtpDto {
  @IsNotEmpty()
  phoneNumber: string;
}
