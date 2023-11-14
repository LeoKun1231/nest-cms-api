/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-11-13 14:12:54
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 18:53:22
 * @FilePath: \cms\src\shared\upload\interfaces\file.interface.ts
 * @Description:
 */
export interface UploadFileInterface {
	fieldname: string;
	originalname: string;
	encoding: string;
	mimetype: string;
	destination: string;
	filename: string;
	path: string;
	size: number;
}
