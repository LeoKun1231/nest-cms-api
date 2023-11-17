/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 20:59:52
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:33:11
 * @FilePath: \cms\src\modules\goods-info\goods-info.module.ts
 * @Description:
 */
import { GoodsInfo } from "@/shared/entities/goods-info.entity";
import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GoodsCategoryModule } from "../goods-category/goods-category.module";
import { GoodsInfoController } from "./goods-info.controller";
import { GoodsInfoService } from "./goods-info.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([GoodsInfo]),
		forwardRef(() => GoodsCategoryModule),
	],
	controllers: [GoodsInfoController],
	providers: [GoodsInfoService],
	exports: [GoodsInfoService],
})
export class GoodsInfoModule {}
