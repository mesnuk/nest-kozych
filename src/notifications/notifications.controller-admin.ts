import {Controller, Get, Param, UseGuards, Query, NotFoundException} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {AdminGuard} from '../auth/admin.guard';
import {AdminAuthDecType, AdminDec, AdminRoles} from '../auth/decorators/admin.decorator';
import {ApiOperation, ApiQuery, ApiTags} from '@nestjs/swagger';
import {AdminRolesEnum} from '../admins/types/admin.types';
import {paginateQueryDto} from '../common/main.dto';
import {FilterConfigType} from '../common/types';
import {serializeSort} from '../common/helpers';

@ApiTags('Notifications')
@Controller('notifications/admin')
export class NotificationsControllerAdmin {
  constructor(
      private readonly notificationsService: NotificationsService
  ) {}

  @Get('paginate')
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  @ApiQuery({
    name: 'filter',
    type: 'string',
    required: false,
    description: `
      {key: 'type', type: 'string'},
      {key: 'message', type: 'string'},
      {key: 'user_name', type: 'string'},
      {key: 'phone', type: 'string'},
    `
  })
  paginate(
      @Query() query: paginateQueryDto,
      @AdminDec() admin:AdminAuthDecType,
  ) {
    const parseFilter = JSON.parse(query.filter);

    const filterConfig: FilterConfigType = [
      {key: 'type', type: 'string'},
      {key: 'message', type: 'string'},
      {key: 'user_name', type: 'string'},
      {key: 'phone', type: 'string'},
    ]

    return this.notificationsService.paginateQueryBuilder({
      page: +query.page,
      take: +query.take,
      where: parseFilter,
      sort: serializeSort(query.sort),
      whereConfig: filterConfig,
    });
  }

  @Get('get-one/:id')
  findOne(
      @Param('id') id: string
  ) {
    const candidate = this.notificationsService.findOne({
      where: {id: +id},
    });

    if (!candidate){
      throw new NotFoundException('Notification not found')
    }

    return candidate
  }
}
