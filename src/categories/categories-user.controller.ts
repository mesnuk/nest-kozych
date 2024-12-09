import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Param,
  NotFoundException, Patch, Delete
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

@ApiTags('Categories')
@Controller('categories/user')
export class CategoriesUserController {
  constructor(
      private readonly categoriesService: CategoriesService
  ) {}

  @Get()
  async find() {
    try {
      return await this.categoriesService.findAll();
    }catch (e) {
      console.log(e);
    }
  }

  @Get(':id')
  @ApiOperation({
    description: `<strong>Roles</strong>: ${AdminRolesEnum.ROOT}`,
  })
  async findOne(
      @Param('id') id: string
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
}
