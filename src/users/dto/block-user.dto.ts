import {ApiProperty} from '@nestjs/swagger';
import {IsBoolean} from 'class-validator';

export class BlockUserDto {
    @ApiProperty({
        required: true,
        type: Boolean,
        example: true,
    })
    @IsBoolean()
    is_block: boolean;
}
