import { IsNotEmpty } from 'class-validator';
export default class ValidateOtpDto {
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  otp: string;
}
