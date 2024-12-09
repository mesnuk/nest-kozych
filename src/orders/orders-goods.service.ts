import {BadRequestException, Injectable} from '@nestjs/common';
import { CreateOrderUserDto } from './dto/create-order-user.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import {EntityRepository} from '../common/db-entity-repository';
import {User} from '../users/entities/user.entity';
import {Order} from './entities/order.entity';
import {DataSource, In} from 'typeorm';
import {GoodsService} from '../goods/goods.service';
import {OrderStatusEnum} from './types/order.types';
import {OrderGoods} from './entities/order-goods.entity';

@Injectable()
export class OrdersGoodsService extends EntityRepository<OrderGoods> {

  constructor(
      dataSource: DataSource
  ) {
    super(OrderGoods, dataSource)
  }

}
