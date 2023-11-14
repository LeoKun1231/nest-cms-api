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
