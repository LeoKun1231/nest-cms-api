import { Module } from "@nestjs/common";
import { AppLoggerSevice } from "./logger.service";

@Module({
	controllers: [],
	providers: [AppLoggerSevice],
	exports: [AppLoggerSevice],
})
export class LoggerModule {}
