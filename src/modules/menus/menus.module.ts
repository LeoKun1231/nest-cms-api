import { Menu } from "@/shared/entities/menu.entity";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MenusController } from "./menus.controller";
import { MenusService } from "./menus.service";

@Module({
	imports: [TypeOrmModule.forFeature([Menu])],
	controllers: [MenusController],
	providers: [MenusService],
	exports: [MenusService],
})
export class MenusModule {}
