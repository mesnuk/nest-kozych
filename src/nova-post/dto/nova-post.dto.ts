import {ApiProperty} from '@nestjs/swagger';
import {IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, MinLength} from 'class-validator';

export class GetCityQueryDto {
    @ApiProperty({
        type: String,
        required: false,
        description: 'City ref'
    })
    @IsString()
    @IsOptional()
    ref: string = ''

    @ApiProperty({
        type: String,
        required: false,
        description: 'Region ref for city'
    })
    @IsString()
    @IsOptional()
    regionRef: string = ''

    @ApiProperty({
        type: String,
        example: 'київ',
        required: true,
        minLength: 2,
        description: 'City name for search by includes'
    })
    @IsString()
    @MinLength(2)
    cityName: string

    @ApiProperty({
        type: String,
        example: '00000000-0000-0000-0000-000000000000',
        required: false,
        minLength: 2,
        description: 'Area ref for city'
    })
    @IsString()
    @IsOptional()
    areaRef: string = ''

    @ApiProperty({
        type: String,
        example: '1',
        required: false,
        description: 'Page number'
    })
    @IsNumberString()
    @IsOptional()
    page: string = '1'

    @ApiProperty({
        type: String,
        example: '15',
        required: false,
        description: 'Take count'
    })
    @IsNumberString()
    @IsOptional()
    take: string = '15'
}

export class GetWarehouseQueryDto {
    @ApiProperty({
        type: String,
        required: false,
        description: 'По назві населеного пункуту ',
        example: 'Київ',
    })
    @IsString()
    @IsOptional()
    cityName: string = ''

    @ApiProperty({
        type: String,
        required: false,
        description: 'Пошук відділення за його номером',
        example: '1',
    })
    warehouseId: string

    @ApiProperty({
        type: String,
        required: false,
        description: 'Пошук відділення за його назвою',
        example: 'Відділення №8',
    })
    findByString: string

    @ApiProperty({
        type: String,
        required: false,
        example: 'e71629ab-4b33-11e4-ab6d-005056801329',
        description: 'РЕФ міста із довідника населенних пунктів України, /get-all-cities',
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    cityRef: string

    @ApiProperty({
        type: String,
        example: '1',
        required: false,
        description: 'Page number'
    })
    @IsNumberString()
    @IsOptional()
    page: string = '1'

    @ApiProperty({
        type: String,
        example: '15',
        required: false,
        description: 'Take count'
    })
    @IsNumberString()
    @IsOptional()
    take: string = '15'
}



export class GetStreetQueryDto {
    @ApiProperty({
        type: String,
        required: false,
        description: 'Пошук вулиці за її назвою',
        example: 'Тернавська',
    })
    @IsString()
    @IsOptional()
    findByString: string

    @ApiProperty({
        type: String,
        required: true,
        example: 'e71629ab-4b33-11e4-ab6d-005056801329',
        description: 'РЕФ міста із довідника населенних пунктів України, /get-all-cities',
    })
    @IsString()
    @IsNotEmpty()
    cityRef: string= ''

    @ApiProperty({
        type: String,
        example: '15',
        required: false,
        description: 'Take count'
    })
    @IsNumberString()
    @IsOptional()
    take: string = '15'
}