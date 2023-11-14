/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 21:00:07
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 20:22:35
 * @FilePath: \cms\src\shared\entities\goods-category.entity.ts
 * @Description:
 */
import { Column, Entity, OneToMany } from "typeorm";
import { EntityEnum } from "../enums/entity.enum";
import { BaseEntity } from "./base/Base.entity";
import { GoodsInfo } from "./goods-info.entity";

@Entity(EntityEnum.GoodsCategory)
export class GoodsCategory extends BaseEntity {
	@Column({ type: "varchar", length: 50, comment: "商品分类名", unique: true })
	name: string;

	@OneToMany(EntityEnum.GoodsInfo, EntityEnum.GoodsCategory)
	goods: GoodsInfo[];
}
