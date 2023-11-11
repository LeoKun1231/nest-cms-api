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
