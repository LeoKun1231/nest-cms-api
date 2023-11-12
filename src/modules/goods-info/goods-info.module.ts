import { Module } from "@nestjs/common";
import { GoodsInfoService } from "./goods-info.service";
import { GoodsInfoController } from "./goods-info.controller";

@Module({
	controllers: [GoodsInfoController],
	providers: [GoodsInfoService],
})
export class GoodsInfoModule {}
