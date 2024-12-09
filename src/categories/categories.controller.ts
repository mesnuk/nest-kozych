import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Param,
  NotFoundException, Patch, Delete, Query
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import {AdminGuard} from '../auth/admin.guard';
import {AdminAuthDecType, AdminDec, AdminRoles} from '../auth/decorators/admin.decorator';
import {ApiBody, ApiConsumes, ApiOperation, ApiProperty, ApiTags} from '@nestjs/swagger';
import {AdminRolesEnum} from '../admins/types/admin.types';
import {AnyFilesInterceptor} from '@nestjs/platform-express';
import {UpdateCategoryDto} from './dto/update-category.dto';
import {Category} from './entities/category.entity';
import {CategoriesQueryDeleteDto} from './dto/categories.dto';

@ApiTags('Categories')
@Controller('categories/admin')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @UseInterceptors(AnyFilesInterceptor())
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  async create(
      @Body() createCategoryDto: CreateCategoryDto,
      @UploadedFiles() images: Array<Express.Multer.File>,
      @AdminDec() admin:AdminAuthDecType,
  ) {
    return await this.categoriesService.createCategory(createCategoryDto, images);
  }

  @Get()
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @ApiOperation({
    description: `
       <strong>Roles</strong>: ${AdminRolesEnum.ROOT}
       <p>Desacription: Get all categories</p>
    `
  })
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT} `,
  })
  async find(
      @AdminDec() admin:AdminAuthDecType,
  ) {
    return await this.categoriesService.findAll();
  }

  @Get('all-without-tree')
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @ApiOperation({
    description: `
       <strong>Roles</strong>: ${AdminRolesEnum.ROOT}
       <p>Desacription: Get all categories</p>
    `
  })
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT} `,
  })
  async findAll(
      @AdminDec() admin:AdminAuthDecType,
  ) {
    return await this.categoriesService.find();
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
    const category =  await this.categoriesService.manager.getTreeRepository(Category).findDescendantsTree(await this.categoriesService.findOne({
      where: {
        id: +id
      }
    }), {
        relations: ['images', 'parent']
    })

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  update(
      @Param('id') id: string,
      @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoriesService.updateCategory(id, updateCategoryDto)
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @AdminRoles([])

  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  remove(
      @Param('id') id: string,
      @Query() query: CategoriesQueryDeleteDto
  ) {
    return this.categoriesService.deleteCategory(id, +query.goodsTransferTo);
  }

  @Post('add-images/:categoryId')
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
      @Param('categoryId') id: string
  ){
    return await this.categoriesService.addImage(id, files);
  }


  @Delete('delete-image/:categoryId/:imageId')
  @UseGuards(AdminGuard)
  @AdminRoles([])
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  async deleteImage(
        @Param('categoryId') categoryId: string,
        @Param('imageId') imageId: string
  ){
      return await this.categoriesService.removeImage(categoryId, imageId);
  }
}
