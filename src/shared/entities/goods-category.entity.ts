import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base/Base.entity";

@Entity("goods_category")
export class GoodsCategory extends BaseEntity {
	@Column({ type: "varchar", length: 50, comment: "商品分类名", unique: true })
	name: string;
}
