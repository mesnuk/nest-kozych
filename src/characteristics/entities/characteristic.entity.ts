import {
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import {CharacteristicsTypeEnum} from '../types/characteristics.type';
import {Admin} from '../../admins/entities/admin.entity';
import {Category} from '../../categories/entities/category.entity';

@Entity()
export class Characteristic {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string

    @Column({
        type: 'text'
    })
    tech_name: string

    @Column({
        type: 'jsonb',
        array: false,
        default: null,
        nullable: true
    })
    value: any

    @Column({
        type: 'boolean',
        default: false
    })
    is_filter: boolean

    @Column({
        type: 'text',
        nullable: true,
        default: null
    })
    units_of_measurement: string

    @Column({
        type: 'enum',
        enum: CharacteristicsTypeEnum,
        default: CharacteristicsTypeEnum.SELECT
    })
    type: CharacteristicsTypeEnum

    @ManyToOne(()=>Category, category => category.characteristics )
    @JoinColumn({
        name: 'category'
    })
    category: number | Category;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
