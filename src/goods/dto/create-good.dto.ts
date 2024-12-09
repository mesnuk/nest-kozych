import {File} from '../../files/entities/file.entity';
import {Category} from '../../categories/entities/category.entity';
import {ApiProperty} from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsDefined,
    IsNumber,
    IsOptional,
    IsString,
    MaxLength,
    Min,
    MinLength, Validate
} from 'class-validator';
import {Transform, Type} from 'class-transformer';
import {IsNumberOrString} from '../../common/main.dto';

export class CreateGoodDto {
    @ApiProperty({
        example: 'Ноутбук Acer Aspire 5 A515-55G-51HJ (NX.HZREU.00A) Charcoal Black',
        description: 'Название товара',
        required: true,
        minLength: 3,
        maxLength: 1500,
        type: 'string'
    })
    @IsString()
    @MinLength(1)
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

    // images: File[];
    @ApiProperty({
        example: 1,
        description: 'Category id',
        required: true,
        type: 'number'
    })
    @IsNumber()
    @Transform(({value}) => Number(value))
    category: number;

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
        required: false,
        description: 'Characteristics of goods',
        type: 'array',
    })
    @IsArray()
    @IsOptional()
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


    @ApiProperty({
        required: false,
        type: 'array',
        items: {
            format: 'binary',
            type: 'string',
        },
        description: 'Array of images',
    })
    @IsOptional()
    images: Array<any>;
}

export class Characteristic {
    @ApiProperty({
        example: 1,
        description: 'Characteristic id',
        required: true,
        type: 'number'
    })
    @IsNumber()
    id: number;

    @ApiProperty({
        example: 'Ukraine',
        description: 'Characteristic value',
        required: true,
        type: 'string | number'
    })

    @IsDefined()
    @Validate(IsNumberOrString)
    value: string | number
}
