/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 20:59:52
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:33:11
 * @FilePath: \cms\src\modules\goods-info\goods-info.module.ts
 * @Description:
 */
import { GoodsInfo } from "@/shared/entities/goods-info.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GoodsInfoController } from "./goods-info.controller";
import { GoodsInfoService } from "./goods-info.service";

@Module({
	imports: [TypeOrmModule.forFeature([GoodsInfo])],
	controllers: [GoodsInfoController],
	providers: [GoodsInfoService],
	exports: [GoodsInfoService],
})
export class GoodsInfoModule {}
