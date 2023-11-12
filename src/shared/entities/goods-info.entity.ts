import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base/Base.entity";

@Entity({ name: "goods_info" })
export class GoodsInfo extends BaseEntity {
	@Column({ comment: "商品名", unique: true })
	name: string;

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
	address: number;
}
