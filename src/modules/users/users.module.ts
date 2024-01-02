/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-17 17:08:57
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-18 10:15:43
 * @FilePath: \cms\src\modules\users\users.module.ts
 * @Description:
 */
import { Global, Module, forwardRef } from "@nestjs/common";
import { DepartmentModule } from "../department/department.module";
import { RolesModule } from "../roles/roles.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Global()
@Module({
	imports: [forwardRef(() => RolesModule), forwardRef(() => DepartmentModule)],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService, RolesModule, DepartmentModule],
})
export class UsersModule {}
