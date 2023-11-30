/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 20:59:52
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:33:07
 * @FilePath: \cms\src\modules\goods-info\dto\update-goods-info.dto.ts
 * @Description:
 */
import { PartialType } from "@nestjs/swagger";
import { CreateGoodsInfoDto } from "./create-goods-info.dto";

export class UpdateGoodsInfoDto extends PartialType(CreateGoodsInfoDto) {}
