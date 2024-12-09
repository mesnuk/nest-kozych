import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, NotFoundException, Query} from '@nestjs/common';
import { CharacteristicsService } from './characteristics.service';
import { CreateCharacteristicDto } from './dto/create-characteristic.dto';
import { UpdateCharacteristicDto } from './dto/update-characteristic.dto';
import {ApiOperation, ApiQuery, ApiTags} from '@nestjs/swagger';
import {AdminGuard} from '../auth/admin.guard';
import {AdminAuthDecType, AdminDec, AdminRoles} from '../auth/decorators/admin.decorator';
import {AdminRolesEnum} from '../admins/types/admin.types';
import {paginateQueryDto} from '../common/main.dto';
import {FilterConfigType} from '../common/types';
import {serializeSort} from '../common/helpers';


@ApiTags('Characteristics')
@Controller('characteristics/admin')
export class CharacteristicsAdminController {
  constructor(
      private readonly characteristicsService: CharacteristicsService
  ) {}

  @Post()
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  create(
      @Body() createCharacteristicDto: CreateCharacteristicDto,
      @AdminDec() admin:AdminAuthDecType
  ) {
    return this.characteristicsService.createCharacteristic(createCharacteristicDto)
  }

  @Get('paginate/:categoryId')
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
      {key: 'name', type: 'string'},
      {key: 'tech_name', type: 'string'},
      {key: 'is_filter', type: 'boolean'},
      {key: 'units_of_measurement', type: 'string'},
      {key: 'type', type: 'array'}
    `
  })
  async findPaginate(
      @Query() query: paginateQueryDto,
      @AdminDec() admin:AdminAuthDecType,
        @Param('categoryId') categoryId: string
  ) {
    const filterFieldsConfig: FilterConfigType = [
      {key: 'category', type: 'number'},
      {key: 'name', type: 'string'},
      {key: 'tech_name', type: 'string'},
      {key: 'is_filter', type: 'boolean'},
      {key: 'units_of_measurement', type: 'string'},
      {key: 'type', type: 'array'},
    ]

    const parseFilter = JSON.parse(query.filter);

    parseFilter.category = +categoryId

    return await this.characteristicsService.paginateQueryBuilder(
        {
          page: +query.page,
          take: +query.take,
          where: parseFilter,
          sort: serializeSort(query.sort),
          whereConfig: filterFieldsConfig,
          relations: ['category']
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
      @Param('id') id: string
  ) {
    const  characteristic = await this.characteristicsService.customFindOne({id: +id}, ['category'])

    if (!characteristic){
        throw new NotFoundException('Characteristic not found')
    }
    return characteristic
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  update(
      @Param('id') id: string,
      @Body() updateCharacteristicDto: UpdateCharacteristicDto,
      @AdminDec() admin:AdminAuthDecType
  ) {
    return this.characteristicsService.updateCharacteristic(+id, updateCharacteristicDto);
  }



  @Delete(':id')
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  async remove(
      @Param('id') id: string
  ) {
    const candidate = await this.characteristicsService.customFindOne({
      id: +id
    })
    if (!candidate){
      throw new NotFoundException('Characteristic not found')
    }
    return await this.characteristicsService.delete({
        id: +id
    })
  }
}
