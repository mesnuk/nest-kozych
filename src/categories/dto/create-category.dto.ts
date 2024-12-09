import {IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, MaxLength, MinLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';
import {Transform} from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Category name',
    type: String,
    required: true,
    minLength: 3,
    maxLength: 255
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'Category description',
    type: String,
    required: false,
    minLength: 0,
    maxLength: 1500
  })
  @IsString()
  @IsOptional()
  @MinLength(0)
  @MaxLength(1500)
  description: string;

  @ApiProperty({
    example: 1,
    type: Number,
    required: false,
    description: 'Parent category id'
  })
  @IsNumber()
  @Transform(({value}) => {
    return Number(value);
  })
  @IsOptional()
  parent: number = null;

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
