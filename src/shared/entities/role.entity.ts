import { Column, Entity, ManyToMany } from "typeorm";
import { BaseEntity } from "./base/Base.entity";
import { Menu } from "./menu.entity";
import { User } from "./user.entity";

@Entity("role")
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
