import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles, NotFoundException, Query
} from '@nestjs/common';
import { GoodsService } from './goods.service';
import { CreateGoodDto } from './dto/create-good.dto';
import { UpdateGoodDto } from './dto/update-good.dto';
import {ApiBody, ApiConsumes, ApiOperation, ApiTags} from '@nestjs/swagger';
import {AdminGuard} from '../auth/admin.guard';
import {AdminAuthDecType, AdminDec, AdminRoles} from '../auth/decorators/admin.decorator';
import {AnyFilesInterceptor} from '@nestjs/platform-express';
import {AdminRolesEnum} from '../admins/types/admin.types';
import {paginateQueryDto} from '../common/main.dto';
import {FilterConfigType} from '../common/types';

@ApiTags('Goods')
@Controller('goods/admin')
export class GoodsControllerAdmin {
  constructor(private readonly goodsService: GoodsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @UseInterceptors(AnyFilesInterceptor())
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  create(
      @Body() createGoodDto: CreateGoodDto,
      @UploadedFiles() files: Array<Express.Multer.File>,
      @AdminDec() admin:AdminAuthDecType,
  ) {
    return this.goodsService.createGoods(createGoodDto, files);
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @UseInterceptors(AnyFilesInterceptor())
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
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

  @Get()
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  async findPaginate(
      @Query() query: paginateQueryDto,
      @AdminDec() admin:AdminAuthDecType,
  ) {
    const parseFilter = JSON.parse(query.filter);

    const filterConfig: FilterConfigType = [
      {key: 'is_hidden', type: 'boolean'},
      {key: 'amount', type: 'number'},
      {key: 'meta_title', type: 'string'},
      {key: 'code', type: 'string'},
      {key: 'characteristics', type: 'characteristics'}
    ]

    return  await  this.goodsService.paginateQueryBuilder({
        page: +query.page,
        take: +query.take,
        where: parseFilter,
        sort: {id: 'DESC'},
        relations: ['category', 'images'],
        whereConfig: filterConfig
    })
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  update(
      @Param('id') id: string,
      @Body() updateGoodDto: UpdateGoodDto,
      @AdminDec() admin:AdminAuthDecType,
  ) {
    return this.goodsService.updateGoods(+id, updateGoodDto);
  }

  @Post('add-images/:goodsId')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        images: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          }
        },
      },
    },
  })
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  @UseInterceptors(AnyFilesInterceptor())
  async addImage(
      @UploadedFiles() files: Array<Express.Multer.File>,
      @Param('goodsId') id: string
  ){
    return await this.goodsService.addImage(id, files);
  }


  @Delete('delete-image/:goodsId/:imageId')
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  async deleteImage(
      @Param('goodsId') goodsId: string,
      @Param('imageId') imageId: string
  ){
    return await this.goodsService.removeImage(goodsId, imageId);
  }

}
