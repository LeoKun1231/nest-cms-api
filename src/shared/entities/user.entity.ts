/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-17 19:27:23
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 20:00:19
 * @FilePath: \cms\src\shared\entities\user.entity.ts
 * @Description:
 */
import {
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	Relation,
} from "typeorm";
import { EntityEnum } from "../enums/entity.enum";
import { BaseEntity } from "./base/Base.entity";
import { Department } from "./department.entity";
import { Role } from "./role.entity";

@Entity(EntityEnum.User)
export class User extends BaseEntity {
	@Column({ unique: true, comment: "用户名" })
	name: string;

	@Column({ comment: "真实姓名", nullable: true })
	realname: string;

	@Column({ comment: "密码" })
	password: string;

	@Column({ comment: "手机号码", nullable: true })
	cellphone: string;

	@ManyToMany(() => Role, (role) => role.users)
	@JoinTable({ name: "user_role" })
	roles: Relation<Role[]>;

	@ManyToOne(() => Department, (department) => department.users)
	department: Relation<Department>;
}
