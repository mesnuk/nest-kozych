import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min} from 'class-validator';

export class UpdatePasswordUserDto {
    @ApiProperty({
        required: true,
        type: String,
        example: '12345678',
        maxLength: 50,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    prevPassword: string;

    @ApiProperty({
        required: true,
        type: String,
        example: '12345678',
        maxLength: 50,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    newPassword: string;
}
