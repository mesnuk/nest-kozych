import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsNumberString, IsString, Matches} from 'class-validator';
import {ServiceTypes} from '../types/nova.types';


export class CreateInternetDocumentDto {
    @ApiProperty({
        type: String,
        example: '07.02.2023',
        required: true,
        description: 'Дата відправки у форматі дд.мм.рррр'
    })
    @IsString()
    @Matches(/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/, {message: 'Required format: dd.mm.yyyy'})
    @IsNotEmpty()
    DateTime: string

    @ApiProperty({
        type: String,
        example: '0.5',
        required: true,
        description: 'Вага в кг, число в форматі стрічки, наприклад "0.5"'
    })
    @IsString()
    @IsNumberString()
    Weight: string


    // Auto generated from order
    // @ApiProperty({
    //     enum:ServiceTypes,
    //     example: ServiceTypes.WAREHOUSE_WAREHOUSE,
    //     required: true,
    //     description: 'Тип відправлення (склад-склад, склад-двері)'
    // })
    // ServiceType: ServiceTypes

    @ApiProperty({
        type: String,
        example: 'Товар',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    Description: string


    @ApiProperty({
        type: String,
        example: '150',
        required: true,
        description: 'Вартість відправлення в грн, число в форматі стрічки, наприклад "150"'
    })
    @IsString()
    @IsNumberString()
    Cost: string

    @ApiProperty({
        type: String,
        example: 'e7182b3c-4b33-11e4-ab6d-005056801329',
        required: true,
        description: 'Референс міста відправника з довідника населених пунктів України, /get-all-cities'
    })
    @IsString()
    @IsNotEmpty()
    CitySender: string

    @ApiProperty({
        type: String,
        example: 'e7182b3c-4b33-11e4-ab6d-005056801329',
        required: true,
        description: 'Референс контакта відправника з довідника контактів, /get-all-contacts'
    })
    @IsString()
    @IsNotEmpty()
    Sender: string

    @ApiProperty({
        type: String,
        example: '380660000000',
        required: true,
        description: 'Телефон відправника'
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^380\d{9}$/, {message: 'Phone number must be in format 380XXXXXXXXX'})
    SendersPhone: string


    // @ApiProperty({
    //     type: String,
    //     example: '380660000000',
    //     required: true,
    //     description: 'Телефон отримувача, автоматично бери з ордера і заповнюй в цьому полі'
    // })
    // @IsString()
    // @IsNotEmpty()
    // @Matches(/^380\d{9}$/, {message: 'Phone number must be in format 380XXXXXXXXX'})
    // RecipientsPhone: string

    @ApiProperty({
        type: String,
        example: '0.0004',
        required: true,
        description: 'Об\'єм в кубічних метрах, число в форматі стрічки, наприклад "0.0004"'
    })
    @IsString()
    @IsNumberString()
    VolumeGeneral: string

    // Auto generated from order
    // @ApiProperty({
    //     type: String,
    //     example: 'Івано-Франківськ',
    //     required: true,
    //     description: 'Назва міста отримувача в форматі стрічки, наприклад "Івано-Франківськ"'
    // })
    // @IsString()
    // @IsNotEmpty()
    // RecipientCityName: string
}
