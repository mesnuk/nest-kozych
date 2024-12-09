import {
    Column,
    Entity, ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import {Good} from '../../goods/entities/goods.entity';
import {Order} from './order.entity';


@Entity()
export class OrderGoods {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      type: 'numeric'
    })
    count: number;

    @ManyToOne(() => Good )
    goods: Good;

    @ManyToOne(() => Order, (order) => order.goods_list)
    order: Order;
}
