import {IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength} from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { AdminRolesEnum } from "../types/admin.types";

export class CreateAdminDto {
  @ApiProperty({
    required: true,
    type: String,
    example: 'Alex',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  first_name: string

  @ApiProperty({
    required: true,
    type: String,
    example: 'Sanchos',
    maxLength: 50
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  last_name: string

  @ApiProperty({
    required: true,
    type: String,
    example: 'admin@gmail.com',
    maxLength: 150,
    uniqueItems: true
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email: string

  @ApiProperty({
    required: true,
    type: String,
    example: '12345678',
    maxLength: 50,
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(8)
  password: string

  @ApiProperty({
    required: true,
    type: String,
    example: 'root',
    enum: AdminRolesEnum
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(AdminRolesEnum)
  role: string



  @ApiProperty({
    required: false,
    type: String,
    example: 'e72d82f06ccawd2e36cfadbe17e25ba4815',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  nova_post_api_key: string
}
