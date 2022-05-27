import { IsNotEmpty } from 'class-validator';
export default class ValidateOtpDto {
  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  otp: string;
}
