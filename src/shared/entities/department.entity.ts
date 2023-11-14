/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 19:58:56
 * @FilePath: \cms\src\shared\entities\department.entity.ts
 * @Description:
 */
import {
	Column,
	Entity,
	OneToMany,
	Tree,
	TreeChildren,
	TreeParent,
} from "typeorm";
import { EntityEnum } from "../enums/entity.enum";
import { BaseEntity } from "./base/Base.entity";
import { User } from "./user.entity";

@Entity(EntityEnum.Department)
@Tree("materialized-path")
export class Department extends BaseEntity {
	@Column({ length: 50, comment: "部门名称", unique: true })
	name: string;

	@Column({ length: 50, comment: "部门领导", nullable: true })
	leader: string;

	@TreeParent()
	parent: Department;

	@TreeChildren()
	children: Department[];

	@Column({ comment: "父级id", nullable: true })
	parentId: number;

	@OneToMany(() => User, (user) => user.department)
	users: User[];
}
