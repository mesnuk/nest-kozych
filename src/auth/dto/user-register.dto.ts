import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UserRegisterDto {
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
  @IsNotEmpty()
  @MaxLength(50)
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    required: true,
    type: String,
    example: 'Sancho',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @IsString()
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
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    required: true,
    type: String,
    example: '+380123456789',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @IsString()
  @IsNotEmpty()
  // Ask about this regexp
  //@RegExp(/^\+380\d{3}\d{2}\d{2}\d{2}$/)
  phone_number: string;

}