import { PartialType } from '@nestjs/swagger';
import {CreateOrderAdminDto} from './create-order-admin.dto';

export class UpdateOrderDto extends PartialType(CreateOrderAdminDto) {}
