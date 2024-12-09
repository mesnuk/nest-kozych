import { Injectable } from '@nestjs/common';
import {DataSource} from 'typeorm';
import {EntityRepository} from '../common/db-entity-repository';
import {Notification} from './entities/notification.entity';
import {CreateNotificationUserDto} from './dto/create-notification-user.dto';

@Injectable()
export class NotificationsService extends EntityRepository<Notification> {
  constructor(dataSource: DataSource) {
    super(Notification, dataSource);
  }

  async createUserNotification(body: CreateNotificationUserDto) {
    return await this.save(body);
  }
}
