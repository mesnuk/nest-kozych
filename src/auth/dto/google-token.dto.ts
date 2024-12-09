import {IsEmail, IsNotEmpty, IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';


export class GoogleLoginDto {
    @ApiProperty({
        required: true,
        type: String,
        example: 'token'
    })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({
        required: true,
        type: String,
        example: 'test@test.com'
    })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        required: true,
        type: String,
        example: 'Name'
    })
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @ApiProperty({
        required: true,
        type: String,
        example: 'Second Name'
    })
    @IsNotEmpty()
    @IsString()
    last_name: string;
}