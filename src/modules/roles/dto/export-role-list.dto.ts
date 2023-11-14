/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:34:12
 * @FilePath: \cms\src\modules\roles\dto\export-role-list.dto.ts
 * @Description:
 */
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ExportRoleDto } from "./export-role.dto";

export class ExportRoleListDto {
	@ApiProperty({ description: "角色列表", example: [], type: [ExportRoleDto] })
	@Expose()
	@Type(() => ExportRoleDto)
	list: ExportRoleDto[];

	@ApiProperty({ description: "总数", example: 10, type: Number })
	@Expose()
	totalCount: number;
}
