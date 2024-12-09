import {forwardRef, Module} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersControllerUser } from './orders.controller-user';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Order} from './entities/order.entity';
import {UsersModule} from '../users/users.module';
import {GoodsModule} from '../goods/goods.module';
import {OrderGoods} from './entities/order-goods.entity';
import {OrdersGoodsService} from './orders-goods.service';
import {NovaModule} from '../nova-post/nova.module';
import {OrdersControllerAdmin} from './orders.controller-admin';
import {AdminsModule} from '../admins/admins.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderGoods
    ]),
    forwardRef(() => NovaModule),
    UsersModule,
    GoodsModule,
    AdminsModule
  ],
  controllers: [OrdersControllerUser, OrdersControllerAdmin],
  providers: [OrdersService, OrdersGoodsService],
  exports: [OrdersService, OrdersGoodsService]
})
export class OrdersModule {}
