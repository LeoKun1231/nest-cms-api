/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 20:59:52
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 20:23:03
 * @FilePath: \cms\src\shared\entities\goods-info.entity.ts
 * @Description:
 */
import { Column, Entity, ManyToOne, Relation } from "typeorm";
import { EntityEnum } from "../enums/entity.enum";
import { BaseEntity } from "./base/Base.entity";
import { GoodsCategory } from "./goods-category.entity";

@Entity(EntityEnum.GoodsInfo)
export class GoodsInfo extends BaseEntity {
	@Column({ comment: "商品名", unique: true })
	name: string;

	@Column({ comment: "商品描述" })
	desc: string;

	@Column({ comment: "商品旧价格" })
	oldPrice: number;

	@Column({ comment: "商品新价格" })
	newPrice: number;

	@Column({ comment: "商品图片url" })
	imgUrl: string;

	@Column({ comment: "商品库存", default: 0 })
	inventoryCount: number;

	@Column({ comment: "商品销量", default: 0, nullable: true })
	saleCount: number;

	@Column({ comment: "商品收藏数", default: 0, nullable: true })
	favorCount: number;

	@Column({ comment: "商品地址" })
	address: string;

	@ManyToOne(() => GoodsCategory, (category) => category.goods)
	category: Relation<GoodsCategory>;
}
