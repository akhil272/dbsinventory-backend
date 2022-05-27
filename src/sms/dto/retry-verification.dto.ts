import { IsNotEmpty, IsString } from 'class-validator';
import { RetryInitiateDto } from './retry-initiate.dto';

export class RetryVerificationDto extends RetryInitiateDto {
  @IsNotEmpty()
  @IsString()
  otp: string;
}
