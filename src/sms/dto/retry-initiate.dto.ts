import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class RetryInitiateDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+[1-9]\d{1,14}$/)
  phoneNumber: string;
}
