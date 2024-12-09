import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Session } from "../../auth/entities/sesion.entity";
import {Order} from '../../orders/entities/order.entity';
import {RegistrationType} from '../types/admin.types';


@Entity()
export class User {
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
    select: false,
    nullable: true,
    default: null
  })
  password: string;

  @Column({
    type: 'boolean',
    default: false
  })
  is_email_verified: boolean;

  @Column({
    type: 'boolean',
    default: false
  })
  is_block: boolean;

  @OneToMany(()=>Session, session => session.user)
  sessions: Session[];

  @Column({
    type: 'text',
    nullable: true,
    default: null
  })
  location: string;

  @Column({
    type: 'text',
    nullable: true,
    default: null
  })
  phone_number: string;

  @Column({
    type: 'bigint',
    default: 0
  })
  cash_back_amount: number;

  @Column({
    type: 'text',
    default: RegistrationType.EMAIL
  })
  registration_type: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order;

  @Column({
    default: Date.now(),
    type: 'bigint',
  })
  created_at: number;

  @UpdateDateColumn()
  updated_at: Date;
}
