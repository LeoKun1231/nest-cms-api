/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-12 21:00:32
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 20:00:02
 * @FilePath: \cms\src\shared\entities\story.entity.ts
 * @Description:
 */
import { Column, Entity } from "typeorm";
import { EntityEnum } from "../enums/entity.enum";
import { BaseEntity } from "./base/Base.entity";

@Entity(EntityEnum.Story)
export class Story extends BaseEntity {
	@Column({ comment: "故事标题" })
	title: string;

	@Column({ comment: "故事内容", type: "text" })
	content: string;
}
