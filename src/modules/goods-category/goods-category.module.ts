/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 21:00:07
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 20:05:19
 * @FilePath: \cms\src\modules\goods-category\goods-category.module.ts
 * @Description:
 */
import { GoodsCategory } from "@/shared/entities/goods-category.entity";
import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GoodsInfoModule } from "../goods-info/goods-info.module";
import { GoodsCategoryController } from "./goods-category.controller";
import { GoodsCategoryService } from "./goods-category.service";

@Module({
	imports: [
		TypeOrmModule.forFeature([GoodsCategory]),
		forwardRef(() => GoodsInfoModule),
	],
	controllers: [GoodsCategoryController],
	providers: [GoodsCategoryService],
	exports: [GoodsCategoryService],
})
export class GoodsCategoryModule {}
