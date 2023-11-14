/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-13 13:32:03
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 12:10:15
 * @FilePath: \cms\src\shared\upload\upload.controller.ts
 * @Description:
 */
import {
	Controller,
	HttpCode,
	HttpStatus,
	MaxFileSizeValidator,
	ParseFilePipe,
	Post,
	UploadedFile,
	UploadedFiles,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { UploadFileInterface } from "./interfaces/file.interface";
import { UploadService } from "./upload.service";

@Controller()
@ApiTags("文件上传模块")
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

	@Post("upload/single")
	@HttpCode(HttpStatus.OK)
	@UseInterceptors(FileInterceptor("file"))
	uploadSingle(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({
						maxSize: 1024 * 1024 * 10,
						message: "文件大小不能超过10M",
					}),
				],
			}),
		)
		file: UploadFileInterface,
	) {
		return this.uploadService.uploadSingle(file);
	}

	@Post("upload/multiple")
	@HttpCode(HttpStatus.OK)
	@UseInterceptors(FilesInterceptor("file"))
	uploadMultiple(
		@UploadedFiles(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({
						maxSize: 1024 * 1024 * 10,
						message: "文件大小不能超过10M",
					}),
				],
			}),
		)
		files: UploadFileInterface[],
	) {
		return this.uploadService.uploadMultiple(files);
	}

	// todo 大文件上传
}
