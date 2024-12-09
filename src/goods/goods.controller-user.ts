import {
  Controller,
  Get,
  Param,
  NotFoundException, Query
} from '@nestjs/common';
import { GoodsService } from './goods.service';
import {ApiQuery, ApiTags} from '@nestjs/swagger';
import {paginateQueryDto} from '../common/main.dto';
import {FilterConfigType} from '../common/types';

@ApiTags('Goods')
@Controller('goods/user')

export class GoodsControllerUser {
  constructor(private readonly goodsService: GoodsService) {}

  @Get()
  @ApiQuery({
    name: 'filter',
    type: 'string',
    required: false,
    description: `
      {key: 'id', type: 'number'},
      {key: 'amount', type: 'number'},
      {key: 'category', type: 'number'}
      {key: 'meta_title', type: 'string'},
      {key: 'description', type: 'string'},
      {key: 'code', type: 'string'},
      {
        key: 'characteristics', 
        type: 'characteristics', 
        example: {weight: {from: 1, to: 25}, country: ['Україна', 'США'], count: [{ from: 1, to: 25}]}
      }
    `
  })
  async findPaginate(
      @Query() query: paginateQueryDto,
  ) {
    const parseFilter = JSON.parse(query.filter);

    const filterConfig: FilterConfigType = [
      {key: 'amount', type: 'number'},
      {key: 'category', type: 'number'},
      {key: 'id', type: 'number'},
      {key: 'meta_title', type: 'string'},
      {key: 'description', type: 'string'},
      {key: 'code', type: 'string'},
      {key: 'characteristics', type: 'characteristics'},
    ]

    parseFilter.is_hidden = false

    return await  this.goodsService.paginateQueryBuilder({
        page: +query.page,
        take: +query.take,
        where: parseFilter,
        sort: {id: 'DESC'},
        relations: ['images', 'category'],
        whereConfig: filterConfig
    })

    // return await this.goodsService.paginate(+query.page, +query.take, {}, {}, ['category', 'images'])
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    const goods = this.goodsService.customFindOne({
      id: +id
    }, {
      images: true,
      category: true,
    })
    if (!goods){
      throw new NotFoundException('Goods not found')
    }
    return goods
  }
}
