import { Module } from "@nestjs/common";
import { GoodsCategoryModule } from "../goods-category/goods-category.module";
import { GoodsInfoModule } from "../goods-info/goods-info.module";
import { GoodsController } from "./goods.controller";
import { GoodsService } from "./goods.service";

@Module({
	imports: [GoodsCategoryModule, GoodsInfoModule],
	controllers: [GoodsController],
	providers: [GoodsService],
})
export class GoodsModule {}
