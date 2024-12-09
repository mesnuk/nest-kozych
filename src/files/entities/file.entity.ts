import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {FileEntityEnum} from '../types/files.type';
import {Category} from '../../categories/entities/category.entity';
import {Good} from '../../goods/entities/goods.entity';

@Entity()
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    path: string;

    @Column({
        type: 'numeric',
        default: 0
    })
    size: number;

    @Column()
    entity: FileEntityEnum;

    @Column()
    folder_id: string;

    @ManyToOne(() => Category, (category) => category.images, { nullable: true})
    category: Category;

    @ManyToOne(() => Good, (goods) => goods.images, { nullable: true})
    goods: Good;
}
