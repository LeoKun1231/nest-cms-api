import { GoodsCategory } from "@/shared/entities/goods-category.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GoodsCategoryController } from "./goods-category.controller";
import { GoodsCategoryService } from "./goods-category.service";

@Module({
	imports: [TypeOrmModule.forFeature([GoodsCategory])],
	controllers: [GoodsCategoryController],
	providers: [GoodsCategoryService],
})
export class GoodsCategoryModule {}
