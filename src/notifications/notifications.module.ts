import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsControllerAdmin } from './notifications.controller-admin';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Notification} from './entities/notification.entity';
import {NotificationsControllerUser} from './notifications.controller-user';
import {AdminsModule} from '../admins/admins.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Notification
    ]),
    AdminsModule,
  ],
  controllers: [NotificationsControllerAdmin, NotificationsControllerUser],
  providers: [NotificationsService],
})
export class NotificationsModule {}
