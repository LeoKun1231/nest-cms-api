/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-17 17:08:57
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-18 10:15:43
 * @FilePath: \cms\src\modules\users\users.module.ts
 * @Description:
 */
import { Global, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@/shared/entities/user.entity";
import { RolesModule } from "../roles/roles.module";
import { DepartmentModule } from "../department/department.module";

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([User]), RolesModule, DepartmentModule],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService, RolesModule, DepartmentModule],
})
export class UsersModule {}
