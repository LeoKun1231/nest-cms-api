import { Injectable } from "@nestjs/common";
import { CreateGoodsInfoDto } from "./dto/create-goods-info.dto";
import { UpdateGoodsInfoDto } from "./dto/update-goods-info.dto";

@Injectable()
export class GoodsInfoService {
	create(createGoodsInfoDto: CreateGoodsInfoDto) {
		return "This action adds a new goodsInfo";
	}

	findAll() {
		return `This action returns all goodsInfo`;
	}

	findOne(id: number) {
		return `This action returns a #${id} goodsInfo`;
	}

	update(id: number, updateGoodsInfoDto: UpdateGoodsInfoDto) {
		return `This action updates a #${id} goodsInfo`;
	}

	remove(id: number) {
		return `This action removes a #${id} goodsInfo`;
	}
}
