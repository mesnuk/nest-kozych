import {
  Column,
  CreateDateColumn,
  Entity, OneToMany,
  PrimaryGeneratedColumn,
  TreeChildren,
  TreeParent,
  UpdateDateColumn
} from "typeorm";
import { Session } from "../../auth/entities/sesion.entity";
import {Order} from '../../orders/entities/order.entity';


@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text'
  })
  first_name: string;

  @Column({
    type: 'text'
  })
  last_name: string;

  @Column({
    type: 'text'
  })
  email: string;

  @Column({
    type: 'text',
    select: false
  })
  password: string;

  @Column({
    type: 'text'
  })
  role: string;

  @Column({
    type: 'text',
    nullable: true
  })
  nova_post_api_key: string;

  @OneToMany(()=>Session, session => session.admin, { onDelete: 'CASCADE'})
  sessions: Session[];


  @OneToMany(() => Order, (order) => order.user)
  orders: Order;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
