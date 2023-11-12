import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from "@nestjs/common";
import { GoodsInfoService } from "./goods-info.service";
import { CreateGoodsInfoDto } from "./dto/create-goods-info.dto";
import { UpdateGoodsInfoDto } from "./dto/update-goods-info.dto";

@Controller("goods-info")
export class GoodsInfoController {
	constructor(private readonly goodsInfoService: GoodsInfoService) {}

	@Post()
	create(@Body() createGoodsInfoDto: CreateGoodsInfoDto) {
		return this.goodsInfoService.create(createGoodsInfoDto);
	}

	@Get()
	findAll() {
		return this.goodsInfoService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.goodsInfoService.findOne(+id);
	}

	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() updateGoodsInfoDto: UpdateGoodsInfoDto,
	) {
		return this.goodsInfoService.update(+id, updateGoodsInfoDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.goodsInfoService.remove(+id);
	}
}
