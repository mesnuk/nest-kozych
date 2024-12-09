import { PartialType } from '@nestjs/swagger';
import { CreateNotificationUserDto } from './create-notification-user.dto';

export class UpdateNotificationDto extends PartialType(CreateNotificationUserDto) {}
