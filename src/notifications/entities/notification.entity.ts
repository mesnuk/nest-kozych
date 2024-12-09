import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {NotificationsContactTypesEnum, NotificationsTypesEnum} from '../types/notifications.types';

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'text'
    })
    type: NotificationsTypesEnum;

    @Column({
        type: 'text'
    })
    message: string;

    @Column({
        type: 'text'
    })
    user_name: string;

    @Column({
        type: 'text'
    })
    phone: string;

    @Column({
        type: 'text',
        nullable: true,
        default: null
    })
    contactType: NotificationsContactTypesEnum;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
