import {OrderStatusEnum, OrderTypesEnum} from '../types/order.types';
import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {
    IsArray, IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumberString,
    IsObject,
    IsOptional,
    IsString, Matches,
    ValidateNested
} from 'class-validator';
import {Type} from 'class-transformer';
import {
    CreateOrderGoodsDto,
    DeliveryDataNovaPostAddressDto,
    DeliveryDataNovaPostWarehouseDto
} from './create-order-user.dto';



export class CreateOrderAdminDto {
    @ApiProperty({
        example: 1,
        type: 'number',
        required: false
    })
    user: number;

    @ApiProperty({
        example: [{
            id: 1,
            count: 1
        }],
        type: 'array',
        required: true
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderGoodsDto)
    @IsNotEmpty()
    goods: Array<{
        id: number;
        count: number;
    }>;

    @ApiProperty({
        example: 'John',
        type: 'string',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    contact_name: string;

    @ApiProperty({
        example: 'Doe',
        type: 'string',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    contact_surname: string;

    @ApiProperty({
        example: '+380123456789',
        type: 'string',
        required: true,
        pattern: '/^\+380\d{3}\d{2}\d{2}\d{2}$/'
    })
    @IsString()
    @Matches(/^\+380\d{3}\d{2}\d{2}\d{2}$/, { message: 'Phone number is not valid' })
    @IsNotEmpty()
    contact_phone: string;

    @ApiProperty({
        example: 'test@test.com',
        type: 'string',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    contact_email: string;


    @ApiProperty({
        example: OrderTypesEnum.novaPostWarehouse,
        type: 'string',
        required: true,
        enum: OrderTypesEnum
    })
    @IsString()
    @IsNotEmpty()
    @IsEnum(OrderTypesEnum)
    delivery_type: OrderTypesEnum;

    @ApiPropertyOptional({
        example: {},
        type: {
            areaRef: {example: 'dcaad5a7-4b33-11e4-ab6d-005056801329', type: 'string', required: true},
            cityRef: {example: '0df7201a-4b3a-11e4-ab6d-005056801329', type: 'string', required: true},
            warehouseRef: {example: '93c88fd5-116f-11ea-9295-005056b24375', type: 'string', required: false,},
            streetRef: {example: '00000000-0000-0000-0000-000000000000', type: 'string', required: false},
            buildingNumber: {example: '24', type: 'string', required: false},
            floorNumber: {example: '5', type: 'string', required: false},
            apartmentNumber: {example: '230', type: 'string', required: false},
            isHeavyElevator: {example: false, type: 'boolean', required: false},
            isDeliveryToFloor: {example: false, type: 'boolean', required: false}
        },
        required: true
    })
    @IsObject()
    @Type((params) => {
        if (params.object.delivery_type === OrderTypesEnum.novaPostWarehouse){
            return DeliveryDataNovaPostWarehouseDto
        }else if (params.object.delivery_type === OrderTypesEnum.novaPostAddress){
            return DeliveryDataNovaPostAddressDto
        }
    })
    @ValidateNested()
    delivery_data: DeliveryDataNovaPostAddressDto | DeliveryDataNovaPostWarehouseDto;

    @ApiProperty({
        example: 'John',
        type: 'string',
        required: false
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    recipient_name: string;

    @ApiProperty({
        example: 'Doe',
        type: 'string',
        required: false
    })
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    recipient_surname: string;

    @ApiProperty({
        example: '+380123456789',
        type: 'string',
        required: false,
        pattern: '/^\+380\d{3}\d{2}\d{2}\d{2}$/'
    })
    @IsString()
    @IsOptional()
    @Matches(/^\+380\d{3}\d{2}\d{2}\d{2}$/, { message: 'Phone number is not valid' })
    @IsNotEmpty()
    recipient_phone: string;

    @ApiProperty({
        example: false,
        type: 'boolean',
        required: false
    })
    @IsBoolean()
    @IsOptional()
    useCashBack: boolean;

    @ApiProperty({
        example: OrderStatusEnum.pending,
        type: 'string',
        enum: OrderStatusEnum,
        required: false
    })
    @IsString()
    @IsEnum(OrderStatusEnum)
    status: OrderStatusEnum;
}
