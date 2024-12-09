import {ApiProperty} from '@nestjs/swagger';
import {NotificationsContactTypesEnum, NotificationsTypesEnum} from '../types/notifications.types';
import {IsEnum, IsString, MaxLength, MinLength} from 'class-validator';


export class CreateNotificationUserDto {

    @ApiProperty({
        type: String,
        example: NotificationsTypesEnum.QUESTION,
        required: true,
        enum: NotificationsTypesEnum
    })
    @IsString()
    @IsEnum(NotificationsTypesEnum)
    type: NotificationsTypesEnum;

    @ApiProperty({
        type: String,
        example: 'What is your name?',
        required: true,
        minLength: 2,
        maxLength: 300,
    })
    @IsString()
    @MinLength(2)
    @MaxLength(300)
    message: string;

    @ApiProperty({
        type: String,
        example: 'John',
        required: true,
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    user_name: string;

    @ApiProperty({
        type: String,
        example: '+380123456789',
        required: true,
        description: 'Required format: +380XXXXXXXXX',
    })
    @IsString()
    // @RegExp(/^\+380\d{3}\d{2}\d{2}\d{2}$/)
    phone: string;

    @ApiProperty({
        type: String,
        example: NotificationsContactTypesEnum.TELEGRAM,
        required: false,
        enum: NotificationsContactTypesEnum
    })
    @IsString()
    @IsEnum(NotificationsContactTypesEnum)
    contactType: NotificationsContactTypesEnum;
}
