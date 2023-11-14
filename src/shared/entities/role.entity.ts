/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 19:58:32
 * @FilePath: \cms\src\shared\entities\role.entity.ts
 * @Description:
 */
import { Column, Entity, ManyToMany } from "typeorm";
import { EntityEnum } from "../enums/entity.enum";
import { BaseEntity } from "./base/Base.entity";
import { Menu } from "./menu.entity";
import { User } from "./user.entity";

@Entity(EntityEnum.Role)
export class Role extends BaseEntity {
	@Column({ comment: "角色名", unique: true })
	name: string;

	@Column({ comment: "角色描述", nullable: true })
	intro: string;

	@ManyToMany(() => Menu, (menu) => menu.roles)
	menuList: Menu[];

	@ManyToMany(() => User, (user) => user.roles)
	users: User[];
}
