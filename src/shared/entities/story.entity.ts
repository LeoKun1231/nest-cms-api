import { Column, Entity } from "typeorm";
import { BaseEntity } from "./base/Base.entity";

@Entity("story")
export class Story extends BaseEntity {
	@Column({ comment: "故事标题" })
	title: string;

	@Column({ comment: "故事内容", type: "text" })
	content: string;
}
