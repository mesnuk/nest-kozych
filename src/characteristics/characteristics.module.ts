import {forwardRef, Module} from '@nestjs/common';
import { CharacteristicsService } from './characteristics.service';
import { CharacteristicsAdminController } from './characteristics-admin.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Good} from '../goods/entities/goods.entity';
import {AdminsModule} from '../admins/admins.module';
import {CategoriesModule} from '../categories/categories.module';
import {CharacteristicsUserController} from './characteristics-user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Good
    ]),
    AdminsModule,
    forwardRef(() => CategoriesModule),
  ],
  controllers: [CharacteristicsAdminController, CharacteristicsUserController],
  providers: [CharacteristicsService],
  exports: [CharacteristicsService]
})
export class CharacteristicsModule {}
