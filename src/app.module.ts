import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from "@nestjs/config";
import { CategoriesModule } from './categories/categories.module';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import {UsersModule} from "./users/users.module";
import {FilesModule} from './files/files.module';
import { GoodsModule } from './goods/goods.module';
import { CharacteristicsModule } from './characteristics/characteristics.module';
import { OrdersModule } from './orders/orders.module';
import { NovaModule } from './nova-post/nova.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    DatabaseModule,
    CategoriesModule,
    AuthModule,
    AdminsModule,
    UsersModule,
    FilesModule,
    GoodsModule,
    CharacteristicsModule,
    OrdersModule,
    NovaModule,
    NotificationsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
