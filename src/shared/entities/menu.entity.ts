/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 19:59:48
 * @FilePath: \cms\src\shared\entities\menu.entity.ts
 * @Description:
 */
import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	Tree,
	TreeChildren,
	TreeParent,
} from "typeorm";
import { EntityEnum } from "../enums/entity.enum";
import { BaseEntity } from "./base/Base.entity";
import { Role } from "./role.entity";

@Entity(EntityEnum.Menu)
@Tree("materialized-path")
export class Menu extends BaseEntity {
	@Column({ comment: "菜单名称", unique: true })
	name: string;

	@Column({ comment: "菜单层级" })
	type: number;

	@Column({ comment: "菜单路径", nullable: true })
	url: string;

	@Column({ comment: "菜单图标", nullable: true })
	icon: string;

	@Column({ comment: "菜单排序", nullable: true })
	sort: number;

	@Column({
		comment: "菜单权限",
		nullable: true,
	})
	permission: string;

	@TreeParent()
	parent: Menu;

	@TreeChildren()
	children: Menu[];

	@Column({ comment: "父级id", nullable: true })
	parentId: number;

	@ManyToMany(() => Role, (role) => role.menuList)
	@JoinTable()
	@JoinTable({ name: "role_menu" })
	roles: Role[];
}
