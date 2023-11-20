/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-13 13:32:03
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-13 22:25:18
 * @FilePath: \cms\src\shared\upload\upload.service.ts
 * @Description:
 */
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { EnvEnum } from "../enums/env.enum";
import { AppLoggerSevice } from "../logger/logger.service";
import { RedisService } from "../redis/redis.service";
import { UploadFileInterface } from "./interfaces/file.interface";

@Injectable()
export class UploadService {
	constructor(
		private readonly configService: ConfigService,
		private readonly redisService: RedisService,
		private readonly logger: AppLoggerSevice,
	) {
		this.logger.setContext(UploadService.name);
	}

	async uploadSingle(file: UploadFileInterface) {
		this.logger.log(`${this.uploadSingle.name} was called`);
		return await this.getFileURL(file);
	}

	async uploadMultiple(files: UploadFileInterface[]) {
		this.logger.log(`${this.uploadMultiple.name} was called`);
		return await Promise.all(files.map((file) => this.getFileURL(file)));
	}

	async getFileURL(file: UploadFileInterface) {
		//提取出file.destination日期文件夹路径
		const dateFolder = file.destination.split("files")[1].slice(1);
		return {
			url: `${this.configService.get(
				EnvEnum.UPLOAD_ADDRESS,
			)}/api/v1/static/${dateFolder}/${file.filename}`,
			name: file.originalname,
		};
	}
}
