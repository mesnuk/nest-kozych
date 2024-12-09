import {forwardRef, Module} from '@nestjs/common';
import {CategoriesService} from './categories.service';
import {CategoriesController} from './categories.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Category} from './entities/category.entity';

import {AdminsModule} from '../admins/admins.module';
import {FilesModule} from '../files/files.module';
import {File} from '../files/entities/file.entity';
import {CategoriesUserController} from './categories-user.controller';
import {GoodsModule} from '../goods/goods.module';
import {Good} from '../goods/entities/goods.entity';
import {CharacteristicsModule} from '../characteristics/characteristics.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Category, Good
        ]),
        AdminsModule,
        FilesModule,
        forwardRef(() => CharacteristicsModule),
    ],
    controllers: [CategoriesController, CategoriesUserController],
    providers: [CategoriesService],
    exports: [CategoriesService]
})
export class CategoriesModule {
}
