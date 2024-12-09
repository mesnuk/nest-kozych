import {ApiProperty, PartialType} from '@nestjs/swagger';
import {Characteristic, CreateGoodDto} from './create-good.dto';
import {IsArray, IsBoolean, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength} from 'class-validator';
import {Transform, Type} from 'class-transformer';

export class UpdateGoodDto {
    @ApiProperty({
        example: 'Ноутбук Acer Aspire 5 A515-55G-51HJ (NX.HZREU.00A) Charcoal Black',
        description: 'Название товара',
        required: true,
        minLength: 3,
        maxLength: 1500,
        type: 'string'
    })
    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(1500)
    title: string;

    @ApiProperty({
        example: 'найкращий ноутбук в світі',
        description: 'Goods description',
        minLength: 3,
        maxLength: 1000,
        required: false,
        type: 'string'
    })
    @IsString()
    @IsOptional()
    @MinLength(3)
    @MaxLength(1000)
    description: string;

    // // images: File[];
    // @ApiProperty({
    //     example: 1,
    //     description: 'Category id',
    //     required: true,
    //     type: 'number'
    // })
    // @IsNumber()
    // @Transform(({value}) => Number(value))
    // category: number;

    @ApiProperty({
        example: false,
        description: 'Is hidden',
        required: false,
        type: 'boolean'
    })
    @IsBoolean()
    @IsOptional()
    @Transform(({value}) => value=== 'true' || value === true)
    is_hidden: boolean;

    @ApiProperty({
        example: 10,
        description: 'Amount of goods',
        required: true,
        type: 'number'
    })
    @IsNumber()
    @Transform(({value}) => Number(value))
    @Min(0)
    amount: number;

    @ApiProperty({
        example: 1000,
        description: 'Price of goods',
        required: true,
        type: 'number'
    })
    @IsNumber()
    @Transform(({value}) => Number(value))
    @Min(0)
    price: number;

    @ApiProperty({
        example: [
            {
                id: 1,
                value: 'Ukraine'
            },
            {
                id: 2,
                value: 250
            }
        ],
        required: true,
        description: 'Characteristics of goods',
        type: 'array',
    })
    @IsArray()
    @Transform(({value}) => {
        if (typeof value === 'string') {
            return JSON.parse(`[${value}]`);;
        }
        return value;
    })
    @Type(() => Characteristic)
    characteristics: Array<{
        id: number;
        value: string | number
    }>;
}
