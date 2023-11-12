import { PartialType } from "@nestjs/swagger";
import { CreateGoodsInfoDto } from "./create-goods-info.dto";

export class UpdateGoodsInfoDto extends PartialType(CreateGoodsInfoDto) {}
