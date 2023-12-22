import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
const prisma = new PrismaClient();

async function main() {
	const sqls = fs
		.readFileSync(path.join(__dirname, "../sql/all.sql"), "utf-8")
		.split(";")
		.filter((item) => item.trim() != "");
	for await (const sql of sqls) {
		await prisma.$executeRawUnsafe(sql);
	}
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
