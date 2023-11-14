/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:51:24
 * @FilePath: \cms\src\shared\entities\base\Base.entity.ts
 * @Description:
 */
import {
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

export abstract class BaseEntity {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@CreateDateColumn({
		comment: "创建时间",
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(0)",
		precision: 0,
	})
	createAt: Date;

	@UpdateDateColumn({
		comment: "更新时间",
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP(0)",
		onUpdate: "CURRENT_TIMESTAMP(0)",
		precision: 0,
	})
	updateAt: Date;

	@Column({ comment: "是否删除", default: false })
	isDelete: boolean;

	@Column({ comment: "是否启用", default: true })
	enable: boolean;
}
