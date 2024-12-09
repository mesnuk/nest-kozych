import {forwardRef, Inject, Injectable, NotFoundException} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import {DataSource, Repository} from 'typeorm';
import { Category } from "./entities/category.entity";
import {EntityRepository} from '../common/db-entity-repository';
import {FilesService} from '../files/files.service';
import {FileEntityEnum} from '../files/types/files.type';
import {UpdateCategoryDto} from './dto/update-category.dto';
import {InjectRepository} from '@nestjs/typeorm';
import {Good} from '../goods/entities/goods.entity';
import {CharacteristicsService} from '../characteristics/characteristics.service';

@Injectable()
export class CategoriesService extends EntityRepository<Category> {
  constructor(
      dataSource: DataSource,
      private filesService: FilesService,
      @Inject(forwardRef(()=>CharacteristicsService)) private characteristicsService: CharacteristicsService,
      @InjectRepository(Good) private readonly goodRepository: Repository<Good>
  ) {
    super(Category, dataSource);
  }
  async createCategory(createCategoryDto: CreateCategoryDto, files: Array<Express.Multer.File>) {

    const parentCategory = await this.customFindOne({
      id: +createCategoryDto.parent
    })

    const images = await this.filesService.writeFiles(
        files,
        FileEntityEnum.CATEGORY,
    )
    const result = await this.save({
      name: createCategoryDto.name,
      parent: createCategoryDto.parent ? parentCategory : null,
      deep: parentCategory ? parentCategory.deep + 1 : 0,
      images: images,
      description: createCategoryDto.description,
    })

    return await this.customFindOne({
      id: result.id
    },{
        images: true,
        parent: true,
    })
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const candidate = await this.customFindOne({
        id: +id
    })
    if (!candidate){
        throw new NotFoundException('Category not found')
    }
    let updateObj: {
        name?: string,
        description?: string,
        parent?: Category,
        deep?: number,
    } = {
        description: updateCategoryDto.description,
        name: updateCategoryDto.name
    }

    if (updateCategoryDto?.parent){
      const parenCategory = await this.customFindOne({
        id: updateCategoryDto.parent
      }, ['children'])

      if (!parenCategory){
        throw new NotFoundException('Parent category not found')
      }
      updateObj.deep = parenCategory.deep + 1

      await this.save({
        ...parenCategory,
        children: [...parenCategory.children, candidate]
      })
    }

    return await this.customUpdate({id: +id}, updateObj, ['images', 'parent', 'children'])
  }

  async deleteCategory(id: string, goodsTransferTo: number = null) {
    const candidate = await this.customFindOne({
      id: +id,
    }, [], true)
    if (!candidate){
      throw new NotFoundException('Category not found')
    }

    if (candidate.children.length){
        throw new NotFoundException('Category has children delete them first')
    }

    if (!goodsTransferTo){
      const good = await this.goodRepository.findOne({
        where: {
          category: candidate
        }
      })

      if (good){
        throw new NotFoundException('Category has goods, transfer them first to another category')
      }
    }else {
      const goodsTransferToTarget = await this.findOne({
        where: {
            id: goodsTransferTo
        }
      })

      if (!goodsTransferToTarget){
          throw new NotFoundException('Category transfer to not found')
      }

      if (goodsTransferToTarget.id === candidate.id){
        throw new NotFoundException('Category transfer to can not be the same category')
      }

      if (candidate.characteristics.length){
        await this.characteristicsService.update({
            category: candidate
        }, {
            category: goodsTransferToTarget
        })
      }

      await this.goodRepository.update({category: candidate }, {
        category: goodsTransferToTarget
      })
    }

    await this.filesService.deleteFiles(candidate.images.map((image)=>image.id))
    return await this.delete({
        id: +id
    })
  }

  async findAll() {
    return await this.manager.getTreeRepository(Category).findTrees({
        relations: ['images', 'parent'],
    })
  }

  async addImage(id: string, files: Array<Express.Multer.File>) {
    const candidate = await this.customFindOne({
      id: +id
    },['images'])
    if (!candidate){
      throw new NotFoundException('Category not found')
    }

    const images = await this.filesService.writeFiles(
        files,
        FileEntityEnum.CATEGORY,
    )

    return await this.save({
        ...candidate,
        images: [...candidate.images, ...images]
    })
  }

  async removeImage(id: string, imageId: string) {
    const candidate = await this.customFindOne({
      id: +id
    },['images'])
    if (!candidate){
      throw new NotFoundException('Category not found')
    }

    const image = candidate.images.find((image)=>image.id === +imageId)
    if (!image){
      throw new NotFoundException('Image not found')
    }

    await this.filesService.deleteFiles([image.id])
    return await this.save({
        ...candidate,
        images: candidate.images.filter((image)=>image.id !== +imageId)
    })
  }
}
