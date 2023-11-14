import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class ExportGoodsInfoDto {
	@ApiProperty({ description: "商品ID", example: 32, type: Number })
	@Expose()
	id: number;

	@ApiProperty({
		description: "商品名称",
		example: "2018新款时尚百搭黑色宽松机车皮夹克+网纱半身裙套装两件套",
		type: String,
	})
	@Expose()
	name: string;

	@ApiProperty({ description: "原价", example: "226", type: String })
	@Expose()
	oldPrice: string;

	@ApiProperty({ description: "现价", example: "158", type: String })
	@Expose()
	newPrice: string;

	@ApiProperty({
		description: "商品描述",
		example: "2018新款时尚百搭黑色宽松机车皮夹克+网纱半身裙套装两件套",
		type: String,
	})
	@Expose()
	desc: string;

	@ApiProperty({ description: "商品状态", example: 1, type: Number })
	@Expose()
	status: number;

	@ApiProperty({
		description: "商品图片URL",
		example:
			"http://s3.mogucdn.com/mlcdn/55cf19/180917_7e2fdc2d8131698jkg69c9586lkel_640x960.jpg_560x999.jpg",
		type: String,
	})
	@Expose()
	imgUrl: string;

	@ApiProperty({ description: "库存数量", example: 1589, type: Number })
	@Expose()
	inventoryCount: number;

	@ApiProperty({ description: "销售数量", example: 16985, type: Number })
	@Expose()
	saleCount: number;

	@ApiProperty({ description: "收藏数量", example: 28, type: Number })
	@Expose()
	favorCount: number;

	@ApiProperty({ description: "商品所在地址", example: "西安", type: String })
	@Expose()
	address: string;

	@ApiProperty({ description: "商品分类ID", example: 8, type: Number })
	@Expose()
	categoryId: number;

	@ApiProperty({
		description: "创建时间",
		example: "2021-04-30 13:40:30",
		type: Date,
	})
	@Expose()
	createAt: Date;

	@ApiProperty({
		description: "更新时间",
		example: "2021-04-30 13:40:30",
		type: Date,
	})
	@Expose()
	updateAt: Date;
}
