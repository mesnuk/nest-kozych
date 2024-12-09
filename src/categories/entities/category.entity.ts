import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  TreeChildren,
  TreeParent, Tree, OneToMany, ManyToMany, JoinTable, ManyToOne
} from 'typeorm';
import {File} from '../../files/entities/file.entity';
import {Good} from '../../goods/entities/goods.entity';
import {Characteristic} from '../../characteristics/entities/characteristic.entity';


@Entity()
@Tree("closure-table", {
  closureTableName: "category_closure",
  ancestorColumnName: (column) => "ancestor_" + column.propertyName,
  descendantColumnName: (column) => "descendant_" + column.propertyName,
})
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;

  @Column({
    length: 1500,
    default: null,
    nullable: true
  })
  description: string;

  @Column({
    type: 'int'
  })
  deep: number;
  @TreeChildren()
  children: Category[]

  @TreeParent()
  parent: Category

  @OneToMany(() => File, (file) => file.category, {cascade: true, onDelete: 'CASCADE'})
  images: File[];

  @OneToMany(() => Good, (goods) => goods.category)
  goods: Good[];

  @OneToMany(() => Characteristic, (characteristic) => characteristic.category, {cascade: true, onDelete: 'CASCADE'})
  characteristics: Characteristic[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
