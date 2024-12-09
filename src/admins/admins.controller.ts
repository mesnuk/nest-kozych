import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, NotFoundException} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import {ApiOperation, ApiQuery, ApiTags} from '@nestjs/swagger';
import {AdminGuard} from '../auth/admin.guard';
import {AdminAuthDecType, AdminDec, AdminRoles} from '../auth/decorators/admin.decorator';
import {paginateQueryDto} from '../common/main.dto';
import {AdminRolesEnum} from './types/admin.types';
import {FilterConfigType} from '../common/types';
import {serializeSort} from '../common/helpers';

@ApiTags('Admins')
@Controller('admins')
export class AdminsController {
  constructor(
    private readonly adminsService: AdminsService
  ) {}

  @Post()
  // @UseGuards(AdminGuard)
  // @AdminRoles([])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  create(
    // @AdminDec() admin:AdminAuthDecType,
    @Body() createAdminDto: CreateAdminDto
  ) {
    return this.adminsService.createAdmin(createAdminDto);
  }

  @Get()
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
      {key: 'email', type: 'string'},
      {key: 'first_name', type: 'string'},
      {key: 'last_name', type: 'string'},
      {key: 'role', type: 'string'},
      {key: 'id', type: 'number'},
      {key: 'nova_post_api_key', type: 'string'}
    `
  })
  async findPaginate(
      @Query() query: paginateQueryDto,
      @AdminDec() admin:AdminAuthDecType,
  ) {
    const filterFieldsConfig: FilterConfigType = [
      {key: 'email', type: 'string'},
      {key: 'first_name', type: 'string'},
      {key: 'last_name', type: 'string'},
      {key: 'role', type: 'string'},
      {key: 'id', type: 'number'},
      {key: 'nova_post_api_key', type: 'string'}
    ]

    const parseFilter = JSON.parse(query.filter);

    return await this.adminsService.paginateQueryBuilder(
        {
            page: +query.page,
            take: +query.take,
            where: parseFilter,
            sort: serializeSort(query.sort),
            whereConfig: filterFieldsConfig,
        }
    );
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  async findOne(
      @Param('id') id: string,
      @AdminDec() admin:AdminAuthDecType,
  ) {
    return await this.adminsService.customFindOne({id: +id});
  }


  @Patch(':id')
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  update(
      @Param('id') id: string,
      @Body() updateAdminDto: UpdateAdminDto
  ) {
    return this.adminsService.updateAdmin(+id, updateAdminDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  async remove(@Param('id') id: string) {
    const candidate = await this.adminsService.customFindOne({
      id: +id
    })

    if (!candidate){
      throw new NotFoundException('Admin not found')
    }

    return await this.adminsService.delete({
      id: +id
    })
  }
}
