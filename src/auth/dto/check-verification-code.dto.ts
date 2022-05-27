import { IsNotEmpty, IsString } from 'class-validator';

export class CheckVerificationCodeDto {
  @IsNotEmpty()
  @IsString()
  verification_code: string;
}
