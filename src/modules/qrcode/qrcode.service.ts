import { RedisKeyEnum, ScanStatusEnum } from "@/shared/enums";
import { AppLoggerSevice } from "@/shared/logger";
import { RedisService } from "@/shared/redis";
import { BadRequestException, Injectable } from "@nestjs/common";
import * as QRCode from "qrcode";
import { v4 as UUID } from "uuid";

@Injectable()
export class QrcodeService {
	constructor(
		private readonly logger: AppLoggerSevice,
		private readonly redisService: RedisService,
	) {
		this.logger.log(QrcodeService.name);
	}

	async generateQRCode() {
		this.logger.log(`${this.generateQRCode.name} was called`);
		try {
			const uuid = UUID();
			const dataUrl = await QRCode.toDataURL(
				"https://scan.hqk10.xyz?id=" + uuid,
			);
			// 生成二维码并存入redis 有效期30分钟
			this.redisService.setex(
				RedisKeyEnum.QrcodeKey + uuid,
				60 * 30,
				ScanStatusEnum.NotScan,
			);
			return {
				id: uuid,
				url: dataUrl,
			};
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("生成二维码失败");
		}
	}

	async checkStatus(id: string) {
		try {
			const status = await this.redisService._get(RedisKeyEnum.QrcodeKey + id);
			if (status == null) {
				return {
					status: ScanStatusEnum.Expired,
				};
			}
			return { status };
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("获取二维码状态失败");
		}
	}

	async scanQRCode(id: string) {
		this.logger.log(`${this.scanQRCode.name} was called`);
		try {
			const status = await this.redisService._get(RedisKeyEnum.QrcodeKey + id);
			if (status == null) {
				throw new BadRequestException("二维码已过期");
			}
			this.redisService._set(
				RedisKeyEnum.QrcodeKey + id,
				ScanStatusEnum.Scanned,
			);
			return "扫码成功";
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("扫码失败");
		}
	}

	async confirmQRCode(id: string) {
		this.logger.log(`${this.scanQRCode.name} was called`);
		try {
			const status = await this.redisService._get(RedisKeyEnum.QrcodeKey + id);
			if (status == null) {
				throw new BadRequestException("二维码已过期");
			}
			this.redisService._set(
				RedisKeyEnum.QrcodeKey + id,
				ScanStatusEnum.Confirmed,
			);
			return "确认登录成功";
		} catch (error) {
			this.logger.error(error);
			throw new BadRequestException("确认登录失败");
		}
	}

	async cancelQRCode(id: string) {
		this.logger.log(`${this.cancelQRCode.name} was called`);
		try {
			const status = await this.redisService._get(RedisKeyEnum.QrcodeKey + id);
			if (status == null) {
				throw new BadRequestException("二维码已过期");
			}
			this.redisService._set(
				RedisKeyEnum.QrcodeKey + id,
				ScanStatusEnum.Canceled,
			);
			return "取消成功";
		} catch (error) {
			this.logger.error(error);
		}
	}
}
