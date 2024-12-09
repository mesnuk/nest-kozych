import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateGoodDto} from './dto/create-good.dto';
import {EntityRepository} from '../common/db-entity-repository';
import {Good} from './entities/goods.entity';
import {DataSource, In} from 'typeorm';
import {CategoriesService} from '../categories/categories.service';
import {CharacteristicsService} from '../characteristics/characteristics.service';
import {FileEntityEnum} from '../files/types/files.type';
import {FilesService} from '../files/files.service';
import {Characteristic} from '../characteristics/entities/characteristic.entity';
import {CharacteristicsTypeEnum} from '../characteristics/types/characteristics.type';
import {UpdateGoodDto} from './dto/update-good.dto';

@Injectable()
export class GoodsService extends EntityRepository<Good> {
    constructor(
        dataSource: DataSource,
        private categoriesService: CategoriesService,
        private characteristicsService: CharacteristicsService,
        private filesService: FilesService,
    ) {
        super(Good, dataSource);
    }

    async getCharacteristics(
        characteristicsValues: Array<{
            id: number,
            value: string | number
        }>,
        categoryId: number,
        isReturnArray = false
    ): Promise<{
        characteristicFilter: any,
        characteristicFilterMeta: string,
    }>{
        if (!characteristicsValues.length){
            return {
                characteristicFilter: {},
                characteristicFilterMeta: ''
            }
        }
        const characteristics = await this.characteristicsService.customFind({
            id: In(characteristicsValues.map(item => item.id)),
            category: categoryId
        })

       const newCharacteristicsValues:Array<{
              value: string | number,
                characteristic: Characteristic
       }> = []
       for (const item of characteristicsValues){
           const characteristic = characteristics.find(char => char.id === item.id)
           if (!characteristic){
               throw new BadRequestException('Some of characteristics not found')
           }
           if (newCharacteristicsValues.some(char => char.characteristic.id === characteristic.id)){
               continue
           }

            if (
                characteristic.type === CharacteristicsTypeEnum.INTEGER ||
                characteristic.type === CharacteristicsTypeEnum.SELECT_INTEGER
            ){
                if (typeof item.value !== 'number'){
                    throw new BadRequestException('Some of characteristics values has wrong type')
                }
            }else if (characteristic.type === CharacteristicsTypeEnum.SELECT) {
                if (typeof item.value !== 'string') {
                    throw new BadRequestException('Some of characteristics values has wrong type')
                }
            }

            newCharacteristicsValues.push({
                value: item.value,
                characteristic
            })
       }

        let characteristicFilter = {}
        let characteristicFilterMeta = ''

        if (isReturnArray){
            return {
                characteristicFilter: newCharacteristicsValues.map(item => ({
                    value: item.value,
                    name: item.characteristic.name,
                    units_of_measurement: item.characteristic?.units_of_measurement || null,
                    type: item.characteristic.type,
                    id: item.characteristic.id,
                    tech_name: item.characteristic.tech_name
                })),
                characteristicFilterMeta
            }
        }

        for (const charValue of newCharacteristicsValues) {
            characteristicFilter[`${charValue.characteristic.tech_name}`] = {
                value: charValue.value,
                name: charValue.characteristic.name,
                units_of_measurement: charValue.characteristic?.units_of_measurement || null,
                type: charValue.characteristic.type,
                id: charValue.characteristic.id,
                tech_name: charValue.characteristic.tech_name
            }

            if (charValue.characteristic.type === CharacteristicsTypeEnum.SELECT_INTEGER ||
                charValue.characteristic.type === CharacteristicsTypeEnum.INTEGER
            ){
                characteristicFilterMeta += ` ${charValue.characteristic.name} ${String(charValue.value)} ${charValue.characteristic.units_of_measurement || ''} /`
            }else if (charValue.characteristic.type === CharacteristicsTypeEnum.SELECT){
                characteristicFilterMeta += ` ${charValue.characteristic.name} ${charValue.value} /`
            }
        }

        return {
            characteristicFilter,
            characteristicFilterMeta
        }
    }

    async getGoodsCode(){

        const candidate = await this.find({
            order: {
                id: 'DESC'
            },
            take: 1
        })

        if (!candidate.length){
            return '100000000'
        }

        return String(+candidate[0].code + 1)
    }

    async createGoods(createGoodDto: CreateGoodDto, files: Express.Multer.File[]) {
        const category = await this.categoriesService.customFindOne({id: createGoodDto.category});

        if (!category) {
            throw new BadRequestException('Category not found');
        }

        let characteristicsData = {
            characteristicFilter: {},
            characteristicFilterMeta: ''
        }
        if (createGoodDto?.characteristics){
            characteristicsData = await this.getCharacteristics(createGoodDto.characteristics, createGoodDto.category)
        }

        const images = await this.filesService.writeFiles(
            files,
            FileEntityEnum.GOODS,
        )

        const code = await this.getGoodsCode()

        return await this.save({
            code,
            title: createGoodDto.title,
            meta_title: `${createGoodDto.title} / ${characteristicsData.characteristicFilterMeta} / ${ createGoodDto.description}`,
            description: createGoodDto.description,
            images,
            category,
            is_hidden: createGoodDto.is_hidden,
            amount: createGoodDto.amount,
            price: createGoodDto.price,
            characteristics: characteristicsData.characteristicFilter
        })
    }

    async updateCharacteristics(
        categoryId: number,
        oldChar: {
            [key:string]: {
                value: string | number;
                name: string;
                type: string;
                units_of_measurement: string;
                id: number;
                tech_name: string;
            }
        },
        newChars:  Array<{
            id: number;
            value: string | number | null
        }>
    ): Promise<{
        characteristicFilter: {
            [key:string]: {
                value: string | number;
                name: string;
                type: string;
                units_of_measurement: string;
                id: number;
                tech_name: string;
            }
        },
        characteristicFilterMeta: string,
    }>{
        if (!newChars.length){
            return null
        }

        let oldCharValueInArray: Array<{
            value: string | number;
            name: string;
            type: string;
            units_of_measurement: string;
            id: number;
            tech_name: string;
        }> = Object.values(oldChar)

        let newCharExistValues = []

        const notExistChars:Array<{
            id: number;
            value: string | number | null
        }> = []

        for (const newChar of newChars){



            const oldCharValue = oldCharValueInArray.find(item => item.id === newChar.id)

            if (oldCharValue && newChar.value === null){
                oldCharValueInArray = oldCharValueInArray.filter(item => item.id !== oldCharValue.id)

            } else if (oldCharValue && oldCharValue.value !== newChar.value){

                newCharExistValues.push({
                    ...oldCharValue,
                    value: newChar.value
                })
                oldCharValueInArray = oldCharValueInArray.filter(item => item.id !== oldCharValue.id)

            }else {
                notExistChars.push(newChar)
            }
        }
        newCharExistValues = [...newCharExistValues, ...oldCharValueInArray]

        let characteristicsData = []

        if (notExistChars.length) {
            const resultNewChar = await this.getCharacteristics(notExistChars, categoryId, true)
            characteristicsData = resultNewChar.characteristicFilter
        }

        let characteristicFilter = {}
        let characteristicFilterMeta = ''

        for (const charValue of [...newCharExistValues, ...characteristicsData]){
            characteristicFilter[`${charValue.tech_name}`] = {
                value: charValue.value,
                name: charValue.name,
                units_of_measurement: charValue?.units_of_measurement || null,
                type: charValue.type,
                tech_name: charValue.tech_name,
                id: charValue.id
            }

            if (charValue.type === CharacteristicsTypeEnum.SELECT_INTEGER ||
                charValue.type === CharacteristicsTypeEnum.INTEGER
            ){
                characteristicFilterMeta += ` ${charValue.name} ${String(charValue.value)} ${charValue.units_of_measurement || ''} /`
            }else if (charValue.type === CharacteristicsTypeEnum.SELECT){
                characteristicFilterMeta += ` ${charValue.name} ${charValue.value} /`
            }
        }

        return {
            characteristicFilter,
            characteristicFilterMeta
        }
    }

    async updateGoods(id: number, updateGoodDto: UpdateGoodDto) {
        const candidateGoods = await this.findOne({
            where: {id},
            relations: ['category']
        })

        if (!candidateGoods) {
            throw new BadRequestException('Goods not found');
        }

        let newCharacteristics = null
        if (updateGoodDto?.characteristics){
            newCharacteristics = await this.updateCharacteristics(candidateGoods.category.id, candidateGoods.characteristics, updateGoodDto.characteristics)
        }
        let updateData: any = {...updateGoodDto}
        if (!newCharacteristics) {
            delete updateData.characteristics
        }else {
            updateData ={
                ...updateData,
                meta_title: `${updateGoodDto.title ? updateGoodDto.title : candidateGoods.title} / ${newCharacteristics.characteristicFilterMeta} / ${ updateGoodDto.description ? updateGoodDto.description : candidateGoods.description}`,
                characteristics: newCharacteristics.characteristicFilter
            }
        }

        return await this.customUpdate({id}, updateData)
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
