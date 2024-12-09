import {Injectable} from '@nestjs/common';
import {
    DataSource,
    FindOptionsRelations,
    FindOptionsWhere,
    Repository,
    FindOptionsOrder,
    SelectQueryBuilder, FindOptionsUtils
} from 'typeorm';
import {EntityTarget} from 'typeorm/common/EntityTarget';
import {QueryDeepPartialEntity} from 'typeorm/query-builder/QueryPartialEntity';
import {FilterConfigType} from './types';
import {File} from '../files/entities/file.entity';

export type FilterQueryType<T> = FindOptionsWhere<T> | FindOptionsWhere<T>[]


@Injectable()
export abstract class EntityRepository<T> extends Repository<T> {
    target: EntityTarget<T>
    constructor(
        target: EntityTarget<T>,
        dataSource: DataSource,
    ) {
        super(target, dataSource.createEntityManager())
    }

    async paginate(
        page: number = 1,
        take: number = 10,
        filerQuery: FilterQueryType<T> = {},
        sortQuery: FindOptionsOrder<T> = {},
        relations: FindOptionsRelations<T> | string[] = [],
    ):
        Promise<{
            data: T[] | null,
            meta: {
                page: number,
                take: number,
                total: number,
                last_page: number
            }
        }> {
        const skip = (page - 1) * take;
        const [data, total] = await this.findAndCount({
            where: filerQuery,
            take,
            skip,
            order: sortQuery,
            relations
        });

        return {
            data,
            meta: {
                page,
                total,
                take,
                last_page: Math.ceil(total / take)
            }
        };
    }

    getDbFilterQueryBuilder(
        filterBody: any,
        config: FilterConfigType,
        relations: string[] = [],
    ):SelectQueryBuilder<T>{
        let filter = ``
        let valuesForFilter = {}

        for (const configItem of config) {
            const startFilter = filter.length ? ' AND ' : ''

            if (filterBody[configItem.key] === null){
                filter += `${startFilter} ${configItem.key} = :${configItem.key}`
                valuesForFilter [configItem.key] = filterBody[configItem.key]
            }else if (typeof filterBody[configItem.key] === 'undefined') {
                continue
            }

            if (configItem.type === 'string') {
                if (filterBody[configItem.key]){
                    filter += `${startFilter} Object.${configItem.key} ilike :${configItem.key}`
                    valuesForFilter [configItem.key] = `%${filterBody[configItem.key]}%`
                }

            }else if (configItem.type === 'number') {
                if (typeof filterBody[configItem.key] === 'number'){
                    filter += `${startFilter} Object.${configItem.key} = :${configItem.key}`
                    valuesForFilter [configItem.key] = filterBody[configItem.key]
                }else if (typeof filterBody[configItem.key] === 'object') {
                    if (!filterBody[configItem.key]?.from && !filterBody[configItem.key]?.to){
                        continue
                    }

                    filter += `${startFilter} Object.${configItem.key} >= :${configItem.key}From AND Object.${configItem.key} <= :${configItem.key}To`
                    valuesForFilter [`${configItem.key}From`] = filterBody[configItem.key]?.from || 0
                    valuesForFilter [`${configItem.key}To`] = filterBody[configItem.key]?.to || 0
                }

            }else if (configItem.type === 'boolean') {
                filter += `${startFilter} Object.${configItem.key} = :${configItem.key}`
                valuesForFilter [configItem.key] = filterBody[configItem.key]

            }else if (configItem.type === 'array') {
                if (Array.isArray(filterBody[configItem.key])){
                    if (!filterBody[configItem.key].length){
                        continue
                    }
                    filter += `${startFilter} Object.${configItem.key} IN (:...${configItem.key})`
                    valuesForFilter [configItem.key] = filterBody[configItem.key]
                }

            }else if (configItem.type === 'characteristics') {
                const characteristicsKeys = Object.keys(filterBody[configItem.key])

                for (const characteristicsKey of characteristicsKeys) {
                    if (Array.isArray(filterBody[configItem.key][characteristicsKey])){
                        if (!filterBody[configItem.key][characteristicsKey].length){
                            continue
                        }
                        if (typeof filterBody[configItem.key][characteristicsKey][0] === 'string'){
                            // value ['China', 'Ukraine']
                            filter += `${startFilter} Object.characteristics #>> '{${characteristicsKey}, value}' IN (:...${configItem.key}${characteristicsKey})`
                            valuesForFilter [`${configItem.key}${characteristicsKey}`] = filterBody[configItem.key][characteristicsKey]
                        }else if (typeof filterBody[configItem.key][characteristicsKey][0] === 'object'){
                            // value [{from: 0, to: 100}]
                            let statStrFilter = ''
                            for (const item of filterBody[configItem.key][characteristicsKey]) {
                                statStrFilter += `${statStrFilter.length ? ' OR' : '' } Object.characteristics #>> '{${characteristicsKey}, value}' >= '${item.from}' AND Object.characteristics #>> '{${characteristicsKey}, value}' <= '${item.to}'`
                            }
                            filter += `${startFilter} (${statStrFilter})`
                        }
                    }else if (typeof filterBody[configItem.key][characteristicsKey] === 'object'){
                        // value {from: 0, to: 100}
                        filter += `${startFilter} Object.characteristics #>> '{${characteristicsKey}, value}' >= :${configItem.key}${characteristicsKey}From AND Object.characteristics #>> '{${characteristicsKey}, value}' <= :${configItem.key}${characteristicsKey}To`
                        valuesForFilter [`${configItem.key}${characteristicsKey}From`] = filterBody[configItem.key][characteristicsKey]?.from || 0
                        valuesForFilter [`${configItem.key}${characteristicsKey}To`] = filterBody[configItem.key][characteristicsKey]?.to || 0
                    }
                }

            }
        }
        console.log('filter', filter);
        console.log('valuesForFilter', valuesForFilter);

        console.log('Object.description like :description');

        const qb = this.createQueryBuilder("Object").where(filter, valuesForFilter)

        if (relations.length){
            for (const relation of relations) {
                qb.leftJoinAndSelect(`Object.${relation}`, relation)
            }
        }

        return qb

    }

    async paginateQueryBuilder(
        config: {
            page?: number
            take?: number,
            where?: any
            sort?: FindOptionsOrder<T>
            relations?: string[],
            whereConfig?: FilterConfigType
        }
    ):
        Promise<{
            data: T[] | null,
            meta: {
                page: number,
                total: number,
                take: number,
                last_page: number
            }
        }> {

        const configDefault = {
            page: 1,
            take: 10,
            where: {},
            sort: {},
            relations: [],
            whereConfig: []
        }
        const configFull = {...configDefault, ...config}

        const skip = (configFull.page - 1) * configFull.take;


        for (const sortKey of Object.keys(configFull.sort)) {
            configFull.sort[`Object.${sortKey}`] = configFull.sort[sortKey]
        }

        const [data, total] = await this.getDbFilterQueryBuilder(configFull.where, configFull.whereConfig, configFull.relations).take(configFull.take).skip(skip).orderBy({[`Object.id`]: "DESC"}).getManyAndCount()

        return {
            data,
            meta: {
                page: configFull.page,
                total,
                take: configFull.take,
                last_page: Math.ceil(total / configFull.take)
            }
        };
    }

    async customUpdate(
        filter: FindOptionsWhere<T>,
        data: QueryDeepPartialEntity<T>,
        relations: FindOptionsRelations<T> | string[] = [],
        select: (keyof T)[] = [],
    ):
        Promise<T> {
        await this.update(filter, data);

        return this.findOne({
            where: filter,
            relations: relations,
            select
        })
    }

    customFindOne(
        filerQuery: FilterQueryType<T> = {},
        relations: FindOptionsRelations<T> | string[] = [],
        loadRelationIds: boolean = false,
        select: (keyof T)[] = [],
    ): Promise<T> {
        return this.findOne({
            where: filerQuery,
            relations: relations,
            loadRelationIds,
            select
        });
    }

    customFind(
        filerQuery: FilterQueryType<T> = {},
        relations: FindOptionsRelations<T> | string[] = [],
        loadRelationIds: boolean = false,
    ): Promise<T[]> {
        return this.find({
            where: filerQuery,
            relations: relations,
            loadRelationIds
        });
    }

    // async customSave(
    //     data: QueryDeepPartialEntity<T>,
    //     relations: FindOptionsRelations<T> | string[] = [],
    // ): Promise<T> {
    //     const result = await this.save(data);
    //     if (result && result.id)
    //     return this.findOne({
    //         where: {id: result.id},
    //         relations
    //     });
    // }

}


