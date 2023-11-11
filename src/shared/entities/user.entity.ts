/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-17 19:27:23
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-18 17:26:56
 * @FilePath: \cms\src\entity\Users.entity.ts
 * @Description:
 */
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { BaseEntity } from "./base/Base.entity";
import { Department } from "./department.entity";
import { Role } from "./role.entity";

@Entity("user")
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
	roles: Role[];

	@ManyToOne(() => Department, (department) => department.users)
	department: Department;
}
