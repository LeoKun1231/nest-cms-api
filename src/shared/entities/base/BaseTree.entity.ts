/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:51:28
 * @FilePath: \cms\src\shared\entities\base\BaseTree.entity.ts
 * @Description:
 */
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
