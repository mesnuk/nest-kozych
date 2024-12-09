import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AdminUserLoginDto {


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
}