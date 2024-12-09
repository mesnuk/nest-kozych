import {Module} from '@nestjs/common';
import {FilesController} from './files.controller';
import {FilesService} from './files.service';
import {AdminsModule} from '../admins/admins.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {File} from './entities/file.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            File
        ]),
        AdminsModule
    ],
    controllers: [FilesController],
    providers: [FilesService],
    exports: [FilesService]
})
export class FilesModule {
}
