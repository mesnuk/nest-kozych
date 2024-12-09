import {Controller, Get, Post, Body, Patch, Param, Query, UseGuards, NotFoundException} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {ApiOperation, ApiQuery, ApiTags} from '@nestjs/swagger';
import {paginateQueryDto} from '../common/main.dto';
import {AdminGuard} from '../auth/admin.guard';
import {AdminAuthDecType, AdminDec, AdminRoles} from '../auth/decorators/admin.decorator';
import {AdminRolesEnum} from '../admins/types/admin.types';
import {BlockUserDto} from './dto/block-user.dto';
import {FilterConfigType} from '../common/types';
import {serializeSort} from '../common/helpers';

@ApiTags('Users')
@Controller('users/admin')
export class UsersAdminController {
  constructor(
    private readonly usersService: UsersService
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  @AdminRoles([AdminRolesEnum.ROOT])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  async create(
    @Body() createUserDto: CreateUserDto,
    @AdminDec() admin:AdminAuthDecType
  ) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get()
  @UseGuards(AdminGuard)
  @AdminRoles([AdminRolesEnum.MANAGER])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}, ${AdminRolesEnum.MANAGER}`,
  })
  @ApiQuery({
    name: 'filter',
    type: 'string',
    required: false,
    description: `
      {key: 'first_name', type: 'string'},
      {key: 'last_name', type: 'string'},
      {key: 'email', type: 'string'},
      {key: 'is_email_verified', type: 'boolean'},
      {key: 'is_block', type: 'boolean'},
      {key: 'location', type: 'string'},
      {key: 'phone_number', type: 'string'},
      {key: 'cash_back_amount', type: 'number'},
    `
  })
  async findPaginate(
      @Query() query: paginateQueryDto,
      @AdminDec() admin:AdminAuthDecType
  ) {
    const filterFieldsConfig: FilterConfigType = [
      {key: 'first_name', type: 'string'},
      {key: 'last_name', type: 'string'},
      {key: 'email', type: 'string'},
      {key: 'is_email_verified', type: 'boolean'},
      {key: 'is_block', type: 'boolean'},
      {key: 'location', type: 'string'},
      {key: 'phone_number', type: 'string'},
      {key: 'cash_back_amount', type: 'number'},
    ]

    const parseFilter = JSON.parse(query.filter);

    return await this.usersService.paginateQueryBuilder(
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
  @AdminRoles([AdminRolesEnum.MANAGER])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}, ${AdminRolesEnum.MANAGER}`,
  })
  async findOne(
      @Param('id') id: string,
      @AdminDec() admin:AdminAuthDecType
  ) {
    const user=  await this.usersService.customFindOne({
      id: +id
    })

    if (!user) {
        throw new NotFoundException('User not found');
    }
    return user;
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  async update(
      @Param('id') id: string,
      @Body() updateAdminDto: UpdateUserDto,
      @AdminDec() admin:AdminAuthDecType
  ) {
    return await  this.usersService.updateUser(+id, updateAdminDto);
  }

  @Patch('change-block/:id')
  @UseGuards(AdminGuard)
  @AdminRoles([AdminRolesEnum.MANAGER])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}, ${AdminRolesEnum.MANAGER}`,
  })
  async blockUser(
      @Param('id') id: string,
      @Body() updateDto: BlockUserDto,
      @AdminDec() admin:AdminAuthDecType
  ) {
    return await  this.usersService.blockUser(+id, updateDto);
  }


  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
