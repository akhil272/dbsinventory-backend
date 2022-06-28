import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'Phone number must be in international format',
  })
  phoneNumber: string;

  @IsString()
  @IsOptional()
  addressLine1: string;

  @IsString()
  @IsOptional()
  addressLine2: string;
}
