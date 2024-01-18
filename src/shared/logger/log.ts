/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-16 20:33:45
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-18 14:49:47
 * @FilePath: \cms\src\log.ts
 * @Description:
 */
import { WinstonModule, utilities } from "nest-winston";
import * as winston from "winston";
import "winston-daily-rotate-file";
import { Console } from "winston/lib/winston/transports";
import { loadEnvConfig } from "../config";
import { EnvEnum } from "../enums/env.enum";

function createDailyRotateTrasnport(level: string, filename: string) {
	return new winston.transports.DailyRotateFile({
		level,
		dirname: "logs", //日志文件夹
		filename: `${filename}-%DATE%.log`, //日志名称，占位符 %DATE% 取值为 datePattern 值
		datePattern: "YYYY-MM-DD", //日志轮换的频率，此处表示每天。其他值还有：YYYY-MM、YYYY-MM-DD-HH、YYYY-MM-DD-HH-mm
		zippedArchive: true, //是否通过压缩的方式归档被轮换的日志文件
		maxSize: "20m", // 设置日志文件的最大大小，m 表示 mb 。
		maxFiles: "14d", // 保留日志文件的最大天数，此处表示自动删除超过 14 天的日志文件
		format: winston.format.combine(
			winston.format.timestamp({
				format: "YYYY-MM-DD HH:mm:ss",
			}),
			winston.format.simple(),
		),
	});
}

export function setupLogger() {
	const config = loadEnvConfig();
	const timestamp = config[EnvEnum.TIMESTAMP] === "true";
	const conbine = [];
	if (timestamp) {
		conbine.push(winston.format.timestamp());
	}
	conbine.push(utilities.format.nestLike());
	const consoleTransports = new Console({
		level: (config[EnvEnum.LOG_LEVEL] as string) || "info",
		format: winston.format.combine(...conbine),
	});

	return WinstonModule.createLogger({
		transports: [
			consoleTransports,
			...(config[EnvEnum.LOG_ON]
				? [
						createDailyRotateTrasnport("info", "application"),
						createDailyRotateTrasnport("warn", "error"),
				  ]
				: []),
		],
	});
}
