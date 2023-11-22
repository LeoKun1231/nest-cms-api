import { Module } from "@nestjs/common";
import { QrcodeController } from "./qrcode.controller";
import { QrcodeService } from "./qrcode.service";

@Module({
	controllers: [QrcodeController],
	providers: [QrcodeService],
})
export class QrcodeModule {}
