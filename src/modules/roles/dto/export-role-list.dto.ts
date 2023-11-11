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
