import {ApiProperty, OmitType, PartialType} from '@nestjs/swagger';
import { CreateCharacteristicDto } from './create-characteristic.dto';
import {IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Matches, MinLength} from 'class-validator';
import {CharacteristicsTypeEnum} from '../types/characteristics.type';

export class UpdateCharacteristicDto{
    @ApiProperty({
        example: 'Висота',
        type: String,
        required: false,
        minLength: 3,
    })
    @IsString()
    @IsOptional()
    @MinLength(3)
    name: string

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
    @IsOptional()
    @IsEnum(CharacteristicsTypeEnum)
    type: CharacteristicsTypeEnum
}
