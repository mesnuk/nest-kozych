import {BadRequestException, forwardRef, Inject, Injectable} from '@nestjs/common';
import { CreateCharacteristicDto } from './dto/create-characteristic.dto';
import {EntityRepository} from '../common/db-entity-repository';
import {Characteristic} from './entities/characteristic.entity';
import {DataSource} from 'typeorm';
import {CharacteristicsTypeEnum} from './types/characteristics.type';
import {Category} from '../categories/entities/category.entity';
import {CategoriesService} from '../categories/categories.service';
import {UpdateCharacteristicDto} from './dto/update-characteristic.dto';

@Injectable()
export class CharacteristicsService extends EntityRepository<Characteristic> {

    constructor(
        dataSource: DataSource,
        @Inject(forwardRef(()=>CategoriesService)) private categoriesService: CategoriesService
    ) {
        super(Characteristic, dataSource);
    }

    async createCharacteristic(createCharacteristicDto: CreateCharacteristicDto) {
        const candidate = await this.customFindOne({tech_name: createCharacteristicDto.tech_name, category: createCharacteristicDto.category})

        if (candidate){
            throw new BadRequestException('Characteristic with this techName already exists in this category')
        }

        const category = await this.categoriesService.customFindOne({id: createCharacteristicDto.category})

        if (createCharacteristicDto.type === CharacteristicsTypeEnum.SELECT_INTEGER && createCharacteristicDto.value){
            if (!Array.isArray(createCharacteristicDto.value)){
                throw new BadRequestException('Value must be an array')
            }
            // array of string with example {"from": 3, "to": 5}
            if (createCharacteristicDto.value.some(item => {
                if (typeof item !== 'object'){
                    return true
                }
                return !(item.from && item.to && typeof item.from === 'number' && typeof item.to === 'number');
            })){
                throw new BadRequestException('Value must be an object with "from" and "to" keys and numbers as values')
            }
        }
        if (createCharacteristicDto.type === CharacteristicsTypeEnum.SELECT && createCharacteristicDto.value){
            if (!Array.isArray(createCharacteristicDto.value)){
                throw new BadRequestException('Value must be an array')
            }
            if (createCharacteristicDto.value.some(item => typeof item !== 'string' )){
                throw new BadRequestException('Value must be an array of strings')
            }
        }

        return await this.save({
            ...createCharacteristicDto,
            category
        })
    }

    async updateCharacteristic(id: number, updateCharacteristicDto: UpdateCharacteristicDto) {
        const candidateCharacteristic = await this.customFindOne({id}, {}, true)

        if (!candidateCharacteristic){
            throw new BadRequestException('Characteristic not found')
        }

        if (updateCharacteristicDto.type && updateCharacteristicDto.type === CharacteristicsTypeEnum.SELECT_INTEGER){
            if (!Array.isArray(updateCharacteristicDto.value)){
                throw new BadRequestException('Value must be an array')
            }
            // array of string with example {"from": 3, "to": 5}
            if (updateCharacteristicDto.value.some(item => {
                if (typeof item !== 'object'){
                    return true
                }
                return !(item.from && item.to && typeof item.from === 'number' && typeof item.to === 'number');
            })){
                throw new BadRequestException('Value must be an object with "from" and "to" keys and numbers as values')
            }
        }
        if (updateCharacteristicDto.type && updateCharacteristicDto.type === CharacteristicsTypeEnum.SELECT && updateCharacteristicDto.value){
            if (!Array.isArray(updateCharacteristicDto.value)){
                throw new BadRequestException('Value must be an array')
            }
            if (updateCharacteristicDto.value.some(item => typeof item !== 'string' )){
                throw new BadRequestException('Value must be an array of strings')
            }
        }

        return await this.customUpdate({id} , updateCharacteristicDto, {
            category: true
        })
    }
}
