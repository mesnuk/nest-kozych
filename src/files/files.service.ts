import {BadRequestException, Injectable} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import {EntityRepository} from '../common/db-entity-repository';
import {In, DataSource} from 'typeorm';
import {File} from './entities/file.entity';
import {FileEntityEnum} from './types/files.type';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class FilesService extends EntityRepository<File> {
    constructor(dataSource: DataSource) {
        super(File, dataSource);
    }
    async writeFiles(
        files: Array<Express.Multer.File>,
        entity: FileEntityEnum,
        entityData: any= null
    ): Promise<Array<File>> {
        try {
            if (!files.length){
                return []
            }

            const { UPLOAD_FILE_PATH, SERVER_URL } = process.env
            const folderId = uuidv4()

            const folderPath = path.join(UPLOAD_FILE_PATH, entity, folderId)

            if (!fs.existsSync(folderPath)){
                fs.mkdirSync(folderPath, {recursive: true})
            }

            files = files.map((file)=>{
                return {...file, originalname: `${uuidv4()}.${files[0].originalname.split('.').pop()}`}
            })

            if (files && files.length){
                try {
                    for (const file of files) {
                        fs.writeFileSync(path.join(folderPath,file.originalname), file.buffer)
                    }
                }catch (e){
                    console.log(e)
                }
            }

            return this.save(files.map((file) => {
                return {
                    name: file.originalname,
                    path: `${SERVER_URL}/api/files/get-file/${entity}/${folderId}/${file.originalname}`,
                    size: file.size,
                    entity: entity,
                    folder_id: folderId,
                    // category: entity === FileEntityEnum.CATEGORY ? entityData : null,
                }
            }))
        }catch (e) {
            console.log('error write files', e)
            throw new BadRequestException('Can`t write files')
        }
    }


    async deleteFiles (ids:Array<number>){
        const { UPLOAD_FILE_PATH, SERVER_URL } = process.env
        const files = await this.find({
            where: {
                id: In(ids)
            }
        })

        for (const file of files) {
            const filePath = path.join( UPLOAD_FILE_PATH, file.entity, file.folder_id, file.name)
            if (fs.existsSync(filePath)){
                fs.unlinkSync(filePath)
            }
        }

        return await this.delete({
            id: In(ids)
        })
    }
}
