import {Controller, Get, NotFoundException, Param, Req, Res, UseGuards} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {Request, Response} from "express";


import * as path from 'path';
import * as fs from 'fs';
import {CategoryEntityFolder} from '../categories/types/categories.type';



@ApiTags('Files')
@Controller('files')
export class FilesController {
    constructor() {}
    @Get('/get-file/:entity/:id/:name')
    async getFile (
        @Req() req: Request,
        @Res() res: Response,
        @Param("id") id: string,
        @Param("entity") entity: string,
        @Param("name") name: string,
    ){
        try {
            const {UPLOAD_FILE_PATH} = process.env
            const folderPath = path.join( UPLOAD_FILE_PATH,entity,id,name)
            if (!fs.existsSync(folderPath)){
                res.status(404).json({message: 'File not found'})
                return
            }

            return res.sendFile(folderPath, {root: '/'})
        }catch (e) {
            console.log(e)
            return  res.status(500).json({message: 'smth went wrong'})
        }

    }
}
