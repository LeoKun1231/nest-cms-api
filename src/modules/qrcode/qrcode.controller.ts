import { Controller, Get, Param } from "@nestjs/common";
import { QrcodeService } from "./qrcode.service";
import { Public } from "@/shared/decorators";

@Public()
@Controller("qrcode")
export class QrcodeController {
	constructor(private readonly qrcodeService: QrcodeService) {}

	@Get("generate")
	async generateQRCode() {
		return this.qrcodeService.generateQRCode();
	}

	@Get("check/:id")
	async check(@Param("id") id: string) {
		return this.qrcodeService.checkStatus(id);
	}

	@Get("scan/:id")
	async scanQRCode(@Param("id") id: string) {
		return this.qrcodeService.scanQRCode(id);
	}

	@Get("confirm/:id")
	async confirmQRCode(@Param("id") id: string) {
		return this.qrcodeService.confirmQRCode(id);
	}

	@Get("cancel/:id")
	async cancelQRCode(@Param("id") id: string) {
		return this.qrcodeService.cancelQRCode(id);
	}
}
