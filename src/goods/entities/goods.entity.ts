import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Table,
    UpdateDateColumn
} from 'typeorm';
import {File} from '../../files/entities/file.entity';
import {Category} from '../../categories/entities/category.entity';

@Entity()
export class Good {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    code: string;

    @Column()
    title: string;

    @Column()
    meta_title: string;

    @Column()
    description: string;

    @OneToMany(() => File, (file) => file.goods)
    images: File[];

    @ManyToOne(() => Category, (category) => category.goods)
    category: Category;

    @Column({
        type: 'boolean',
        default: false
    })
    is_hidden: boolean;

    @Column({
        type: 'int',
        default: 0
    })
    amount: number;

    @Column({
        type: 'bigint',
        default: 0
    })
    price: number;

    @Column({
        type: 'jsonb',
        array: false,
        default: '{}'
    })
    characteristics: {
        [key:string]: {
            value: string | number;
            name: string;
            type: string;
            units_of_measurement: string;
            id: number;
            tech_name: string;
        }
    };

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
