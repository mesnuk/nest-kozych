import {
  Controller,
  Get,

  Param,
  UseGuards,
  Query,
  NotFoundException, Post, Body, Patch
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import {ApiOperation, ApiQuery, ApiTags} from '@nestjs/swagger';
import {paginateQueryDto} from '../common/main.dto';
import {FilterConfigType} from '../common/types';
import {serializeSort} from '../common/helpers';
import {AdminGuard} from '../auth/admin.guard';
import {AdminAuthDecType, AdminDec, AdminRoles} from '../auth/decorators/admin.decorator';
import {AdminRolesEnum} from '../admins/types/admin.types';
import {CreateOrderAdminDto} from './dto/create-order-admin.dto';
import {UpdateOrderDto} from './dto/update-order.dto';


@ApiTags('Orders')
@Controller('orders/admin')
export class OrdersControllerAdmin {
  constructor(
      private readonly ordersService: OrdersService
  ) {}


  @Post()
  @UseGuards(AdminGuard)
  @AdminRoles([AdminRolesEnum.MANAGER])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}, ${AdminRolesEnum.MANAGER}`,
  })
  create(
      @Body() createOrderDto: CreateOrderAdminDto,
      @AdminDec() admin:AdminAuthDecType
  ) {
    return this.ordersService.adminCreateOrder(createOrderDto)
  }

  @Patch('/update/:orderId')
  @UseGuards(AdminGuard)
  @AdminRoles([AdminRolesEnum.MANAGER])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}, ${AdminRolesEnum.MANAGER}`,
  })
  update(
      @Param('orderId') orderId: string,
      @Body() updateOrderDto: UpdateOrderDto,
      @AdminDec() admin:AdminAuthDecType
  ){
    return this.ordersService.adminUpdateOrder(+orderId, updateOrderDto, admin)
  }


  @Post('/generate-delivery-invoice/:orderId')
  @UseGuards(AdminGuard)
  @AdminRoles([AdminRolesEnum.MANAGER])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}, ${AdminRolesEnum.MANAGER}`,
  })
  async changeGenerateDeliveryInvoice(
      @Param('orderId') orderId: string,
      @AdminDec() admin:AdminAuthDecType
  ){
    return await this.ordersService.changeGenerateDeliveryInvoice(orderId, admin)
  }
  @Get('/paginate')
  @UseGuards(AdminGuard)
  @AdminRoles([AdminRolesEnum.MANAGER])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}, ${AdminRolesEnum.MANAGER}`,
  })
  @ApiQuery({
    name: 'filter',
    type: 'string',
    required: false,
    description: `
      {key: 'id', type: 'number'},
      {key: 'code', type: 'string'},
      {key: 'amount', type: 'number'},
      {key: 'status', type: 'string'},
      {key: 'delivery_type', type: 'string'},
      {key: 'cash_back', type: 'number'},
      {key: 'is_used_cash_back', type: 'boolean'},
      {key: 'user', type: 'number'},
      {key: 'admin', type: 'number'},
    `
  })
  async findPaginate(
      @Query() query: paginateQueryDto,
      @AdminDec() admin:AdminAuthDecType
  ){
    const filterFieldsConfig: FilterConfigType = [
      {key: 'id', type: 'number'},
      {key: 'code', type: 'string'},
      {key: 'amount', type: 'number'},
      {key: 'status', type: 'string'},
      {key: 'delivery_type', type: 'string'},
      {key: 'cash_back', type: 'number'},
      {key: 'is_used_cash_back', type: 'boolean'},
      {key: 'user', type: 'number'},
      {key: 'admin', type: 'number'},
    ]

    const parseFilter = JSON.parse(query.filter);

    return await this.ordersService.paginateQueryBuilder(
        {
          page: +query.page,
          take: +query.take,
          where: parseFilter,
          sort: serializeSort(query.sort),
          whereConfig: filterFieldsConfig,
          relations: ['user', 'goods_list', 'admin']
        }
    );
  }

  @Get('get-one/:id')
  @UseGuards(AdminGuard)
  @AdminRoles([AdminRolesEnum.MANAGER])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}, ${AdminRolesEnum.MANAGER}`,
  })
  async findOne(
      @Param('id') id: string,
      @AdminDec() admin: AdminAuthDecType
  ) {
    const candidate = await this.ordersService.findOne({
      where: {id: +id},
    })

    if (!candidate){
      throw new NotFoundException('Order not found')
    }

    return candidate
  }

}
