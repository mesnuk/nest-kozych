import {CharacteristicsTypeEnum} from '../types/characteristics.type';
import {ApiProperty} from '@nestjs/swagger';
import {IsBoolean, IsEnum, IsJSON, IsNumber, IsOptional, IsString, Matches, MinLength} from 'class-validator';

export class CreateCharacteristicDto {
    @ApiProperty({
        example: 'Висота',
        type: String,
        required: true,
        minLength: 3,
    })
    @IsString()
    @MinLength(3)
    name: string

    @ApiProperty({
        example: 'high',
        type: String,
        required: true,
        minLength: 3,
        description: 'Technical name only english letters\n' + 'Unique name for each category'
    })
    @IsString()
    @MinLength(3)
    @Matches(/^[a-zA-Z]+$/)
    tech_name: string

    @ApiProperty({
        type: 'json',
        required: false,
        example: null,
        description:`
        ${CharacteristicsTypeEnum.SELECT}: ["ukraine", "usa", "china", "japan"] \n
        ${CharacteristicsTypeEnum.SELECT_INTEGER}: [{"from": 1, "to": 3}, {"from": 3, "to": 5}] \n
        ${CharacteristicsTypeEnum.INTEGER}: null \n
        `
    })
    @IsOptional()
    value: any

    @ApiProperty({
        type: 'boolean',
        required: false,
        example: false
    })
    @IsBoolean()
    @IsOptional()
    is_filter: boolean

    @ApiProperty({
        type: 'text',
        required: false,
        example: 'см'
    })
    units_of_measurement: string

    @ApiProperty({
        type: 'enum',
        enum: CharacteristicsTypeEnum,
        default: CharacteristicsTypeEnum.SELECT
    })
    @IsString()
    @IsEnum(CharacteristicsTypeEnum)
    type: CharacteristicsTypeEnum

    @ApiProperty({
        type: 'number',
        required: true,
        example: 1
    })
    @IsNumber()
    category: number
}
