import {ApiProperty} from '@nestjs/swagger';
import {IsNumberString} from 'class-validator';

export class CategoriesQueryDeleteDto {
    @ApiProperty({
        required: false,
        example: '1',
        type: String,
        description: 'Id category for transfer goods'
    })
    @IsNumberString()
    goodsTransferTo: string;
}