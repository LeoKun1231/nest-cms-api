/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-16 10:01:13
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-16 11:11:39
 * @FilePath: \cms\src\utils\request-info.ts
 * @Description:
 */
import { Request } from "express";
import * as requestIp from "request-ip";

export const getReqMainInfo = (req: Request) => {
	const { query, headers, url, method, body } = req;
	const ip = requestIp.getClientIp(req);

	return JSON.stringify({
		url,
		host: headers.host,
		ip,
		method,
		query,
		body,
	});
};
