import {ApiProperty} from '@nestjs/swagger';
import {
    isJSON,
    IsJSON,
    IsNotEmpty,
    IsNumberString,
    IsOptional,
    IsString, ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';
import {Transform} from 'class-transformer';


export class paginateQueryDto {
    @ApiProperty({
        type: String,
        example: '1',
        required: false,
        description: 'Page number'
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @IsNumberString()
    page: string = '1';

    @ApiProperty({
        type: String,
        example: '10',
        required: false,
        description: 'Limit per page'
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @IsNumberString()
    take: string = '10';

    @ApiProperty({
        type: String,
        example: '{}',
        required: false,
        description: 'Filter json object'
    })
    @IsJSON()
    @IsOptional()
    @IsNotEmpty()
    filter: string = '{}';

    @ApiProperty({
        type: String,
        example: '{"name":"created_at","type":"desc"}',
        required: false,
        description: 'Sort json object'
    })
    @IsJSON()
    @IsOptional()
    @IsNotEmpty()
    sort: string = '{}'
}

@ValidatorConstraint({ name: 'string-or-number', async: false })
export class IsNumberOrString implements ValidatorConstraintInterface {
    validate(text: any, args: ValidationArguments) {
        return typeof text === 'number' || typeof text === 'string';
    }

    defaultMessage(args: ValidationArguments) {
        return '($value) must be number or string';
    }
}