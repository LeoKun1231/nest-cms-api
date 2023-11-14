/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-11 22:22:28
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:31:52
 * @FilePath: \cms\src\modules\department\department.module.ts
 * @Description:
 */
import { Department } from "@/shared/entities/department.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DepartmentController } from "./department.controller";
import { DepartmentService } from "./department.service";

@Module({
	imports: [TypeOrmModule.forFeature([Department])],
	controllers: [DepartmentController],
	providers: [DepartmentService],
	exports: [DepartmentService],
})
export class DepartmentModule {}
