import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
  NotFoundException
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderUserDto } from './dto/create-order-user.dto';
import {ApiQuery, ApiTags} from '@nestjs/swagger';
import {UserGuard} from '../auth/user.guard';
import {UserVariableGuard} from '../auth/user-variable.guard';
import {UserAuthDecType, UserDec, UserVariable} from '../auth/decorators/user.decorator';
import {paginateQueryDto} from '../common/main.dto';
import {FilterConfigType} from '../common/types';
import {serializeSort} from '../common/helpers';

@ApiTags('Orders')
@Controller('orders/user')
export class OrdersControllerUser {
  constructor(
      private readonly ordersService: OrdersService
  ) {}

  @Post()
  @UseGuards(UserVariableGuard)
  create(
      @Body() createOrderDto: CreateOrderUserDto,
      @UserDec() userData: UserVariable
  ) {
    return this.ordersService.userCreateOrder(createOrderDto, userData)
  }

  @Get('/paginate')
  @UseGuards(UserGuard)
  @ApiQuery({
    name: 'filter',
    type: 'string',
    required: false,
    description: `
      {key: 'code', type: 'string'},
      {key: 'status', type: 'string'},
      {key: 'delivery_type', type: 'string'},
      {key: 'cash_back', type: 'number'},
      {key: 'is_used_cash_back', type: 'boolean'},
    `
  })
  async findPaginate(
      @Query() query: paginateQueryDto,
      @UserDec() userData:UserAuthDecType ,
  ){
    const filterFieldsConfig: FilterConfigType = [
      {key: 'code', type: 'string'},
      {key: 'status', type: 'string'},
      {key: 'delivery_type', type: 'string'},
      {key: 'cash_back', type: 'number'},
      {key: 'is_used_cash_back', type: 'boolean'},
      {key: 'user', type: 'number'},
    ]

    const parseFilter = JSON.parse(query.filter);

    parseFilter.user = userData.user.id

    return await this.ordersService.paginateQueryBuilder(
        {
          page: +query.page,
          take: +query.take,
          where: parseFilter,
          sort: serializeSort(query.sort, {created_at: 'DESC'}),
          whereConfig: filterFieldsConfig
        }
    );
  }

  @Get('get-one/:id')
  @UseGuards(UserGuard)
  async findOne(
      @Param('id') id: string,
      @UserDec() userData:UserAuthDecType ,
  ) {
    const candidate = await this.ordersService.findOne({
      where: {id: +id, user: userData.user},
    })

    if (!candidate){
      throw new NotFoundException('Order not found')
    }

    return candidate
  }

    @Patch('annul-order/:id')
    @UseGuards(UserGuard)
    async annulOrder(
        @Param('id') id: string,
        @UserDec() userData:UserAuthDecType ,
    ) {

      return await this.ordersService.annulOrder(+id, userData.user)
    }
}
