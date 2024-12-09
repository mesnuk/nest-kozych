import {IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min} from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserUserDto {
    @ApiProperty({
        required: true,
        type: String,
        example: 'user@gmail.com',
        maxLength: 150,
        uniqueItems: true
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(150)
    email: string;

    @ApiProperty({
        required: true,
        type: String,
        example: 'Sancho',
        maxLength: 150,
    })
    @IsString()
    @IsOptional()
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
    @IsOptional()
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
    phone_number: string;

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
    location: string;
}