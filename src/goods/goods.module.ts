import {forwardRef, Module} from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsControllerAdmin } from './goods.controller-admin';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AdminsModule} from '../admins/admins.module';
import {Good} from './entities/goods.entity';
import {CharacteristicsModule} from '../characteristics/characteristics.module';
import {CategoriesModule} from '../categories/categories.module';
import {FilesModule} from '../files/files.module';
import {GoodsControllerUser} from './goods.controller-user';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Good
    ]),
    AdminsModule,
    CharacteristicsModule,
    CategoriesModule,
    FilesModule
  ],
  controllers: [GoodsControllerAdmin, GoodsControllerUser],
  providers: [GoodsService],
    exports: [GoodsService]
})
export class GoodsModule {}
