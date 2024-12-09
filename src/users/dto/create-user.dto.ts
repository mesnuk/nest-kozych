import {IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min} from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import {RegistrationType} from '../types/admin.types';

export class CreateUserDto {
  @ApiProperty({
    required: true,
    type: String,
    example: 'user@gmail.com',
    maxLength: 150,
    uniqueItems: true
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email: string;

  @ApiProperty({
    required: true,
    type: String,
    example: '12345678',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  password?: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'Sancho',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'Panza',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  last_name: string;

  @ApiProperty({
    required: true,
    type: String,
    example: '+380123456789',
    maxLength: 150,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(150)
      // Ask about this regexp
      //@RegExp(/^\+380\d{3}\d{2}\d{2}\d{2}$/)
  phone_number?: string;

  @ApiProperty({
    required: false,
    type: String,
    example: 'Ukraine, Ivano-Frankivsk',
    maxLength: 150,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(150)
  location?: string;


  @ApiProperty({
    required: false,
    type: Number,
    example: 50,
    minimum:0
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @IsNotEmpty()
  cash_back_amount?: number;

  @ApiProperty({
    required: false,
    type: String,
    example: RegistrationType.EMAIL,
    enum: RegistrationType
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(RegistrationType)
  registration_type?: string;
}