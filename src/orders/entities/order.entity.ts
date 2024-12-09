import {
    Column,
    CreateDateColumn,
    Entity, JoinTable, ManyToMany, ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    TreeChildren,
    TreeParent,
    UpdateDateColumn
} from 'typeorm';
import { Session } from "../../auth/entities/sesion.entity";
import {Good} from '../../goods/entities/goods.entity';
import {User} from '../../users/entities/user.entity';
import {OrderStatusEnum, OrderTypesEnum} from '../types/order.types';
import {File} from '../../files/entities/file.entity';
import {OrderGoods} from './order-goods.entity';
import {Admin} from '../../admins/entities/admin.entity';


@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true
    })
    code: string;

    @OneToMany(() => OrderGoods, (orderGoods) => orderGoods.order)
    goods_list: Good[];

    @Column({
        type: 'numeric',
    })
    amount: number;

    @Column({})
    status: OrderStatusEnum;

    @Column({})
    contact_name: string;

    @Column({})
    contact_surname: string;

    @Column({})
    contact_phone: string;

    @Column({})
    contact_email: string;

    @ManyToOne(() => User, (user) => user.orders, { nullable: true})
    user: User

    @ManyToOne(() => Admin, (admin) => admin.orders, { nullable: true})
    admin: Admin

    @Column({})
    delivery_type: OrderTypesEnum;

    @Column({
        type: 'jsonb',
        array: false,
        default: '{}'
    })
    delivery_data: any

    @Column({ nullable: true })
    recipient_name: string;

    @Column({ nullable: true })
    recipient_surname: string;

    @Column({ nullable: true })
    recipient_phone: string;

    @Column({
        type: 'bigint',
        default: 0,
    })
    cash_back: number;

    @Column({
        type: 'boolean',
        default: false
    })
    is_used_cash_back: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
