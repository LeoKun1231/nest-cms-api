import { Request } from "express";
export const getReqMainInfo = (req: Request) => {
	const { query, headers, url, method, body } = req;
	const ip = getClientIp(req);
	return JSON.stringify({
		url,
		host: headers.host,
		ip,
		method,
		query,
		body,
	});
};

export function getClientIp(req: Request) {
	const realIP = req.headers["x-real-ip"];
	const ip = realIP
		? Array.isArray(realIP)
			? realIP[0]
			: realIP
		: req.ip.slice(7);
	return ip;
}
