/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-18 18:00:08
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-18 20:09:38
 * @FilePath: \cms\src\modules\auth\dto\export-login.dto.ts
 * @Description:
 */
import { ApiProperty } from "@nestjs/swagger";

export class ExportLoginDto {
	@ApiProperty({
		description: "accessToken",
	})
	accessToken: string;

	@ApiProperty({
		description: "refreshToken",
	})
	refreshToken: string;
}
