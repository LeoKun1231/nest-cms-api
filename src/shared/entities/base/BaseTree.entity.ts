import { Column, Tree, TreeChildren, TreeParent } from "typeorm";
import { BaseEntity } from "./Base.entity";

@Tree("materialized-path")
export class BaseTreeEntity<T> extends BaseEntity {
	@TreeParent()
	parent: T;

	@TreeChildren()
	children: T[];

	@Column({ comment: "父级id", nullable: true })
	parentId: number;
}
