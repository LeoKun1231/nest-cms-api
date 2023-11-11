import {
	Column,
	Entity,
	OneToMany,
	Tree,
	TreeChildren,
	TreeParent,
} from "typeorm";
import { BaseEntity } from "./base/Base.entity";
import { User } from "./user.entity";

@Entity("department")
@Tree("materialized-path")
export class Department extends BaseEntity {
	@Column({ length: 50, comment: "部门名称", unique: true })
	name: string;

	@Column({ length: 50, comment: "部门领导" })
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
