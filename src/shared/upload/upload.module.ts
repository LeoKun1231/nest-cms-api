/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-13 13:32:03
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 11:34:43
 * @FilePath: \cms\src\shared\upload\upload.module.ts
 * @Description:
 */
import { ForbiddenException, Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import * as fs from "fs";
import { diskStorage } from "multer";
import * as path from "path";
import { RedisService } from "../redis/redis.service";
import { UploadController } from "./upload.controller";
import { UploadService } from "./upload.service";

/**
 * @description: 生成文件夹路径
 * @return {*}
 */
function generateDirPath() {
	const rootPath = path.resolve(__dirname, `../../../files`);
	if (!fs.existsSync(rootPath)) {
		fs.mkdirSync(rootPath);
	}
	const date = new Date();
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const folder = `${year}-${month}-${day}`;
	const dirPath = path.resolve(__dirname, `../../../files/${folder}`);
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath);
	}
	return dirPath;
}

/**
 * @description: 判断是否可以上传
 * @param {RedisService} redisService
 * @return {*}
 */
async function judgeCanUpload(redisService: RedisService) {
	const today = new Date().toISOString().slice(0, 10);
	const key = `uploads:${today}`;
	let count = parseInt(await redisService.get(key));
	if (!count) {
		count = 0;
	}
	count++;
	if (count > 1001) return false;
	await redisService.set(key, count);
	return count <= 1000;
}

@Module({
	imports: [
		MulterModule.registerAsync({
			useFactory: (redisService: RedisService) => ({
				storage: diskStorage({
					destination: (req, file, cb) => {
						cb(null, generateDirPath());
					},
					filename: (req, file, cb) => {
						cb(null, new Date().getTime() + path.extname(file.originalname));
					},
				}),
				fileFilter: async (req, file, cb) => {
					const canUpload = await judgeCanUpload(redisService);
					if (canUpload) {
						cb(null, true);
					} else {
						cb(new ForbiddenException("今日上传次数已达上限"), false);
					}
				},
			}),
			inject: [RedisService],
		}),
	],
	controllers: [UploadController],
	providers: [UploadService],
})
export class UploadModule {}
