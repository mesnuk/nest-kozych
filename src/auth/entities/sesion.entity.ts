import {
  Column,
  CreateDateColumn,
  Entity, ManyToOne,
  PrimaryGeneratedColumn,
  TreeChildren,
  TreeParent,
  UpdateDateColumn
} from "typeorm";
import { Admin } from "../../admins/entities/admin.entity";
import {User} from "../../users/entities/user.entity";


@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text'
  })
  refreshToken: string;


  @Column({
    type: 'bigint'
  })
  expiresAt: number;

  @ManyToOne(()=>Admin, admin => admin.sessions )
  admin: Admin;

  @ManyToOne(()=>User, user => user.sessions )
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
