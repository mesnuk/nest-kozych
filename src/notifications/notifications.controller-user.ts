import {Controller, Post, Body} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {CreateNotificationUserDto} from './dto/create-notification-user.dto';
import {ApiTags} from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications/user')
export class NotificationsControllerUser {
  constructor(
      private readonly notificationsService: NotificationsService
  ) {}

  @Post('/create')
  async create(
      @Body() body: CreateNotificationUserDto,
  ){
    return await this.notificationsService.createUserNotification(body);
  }
}
