import { BadRequestException, HttpException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaErrorCode } from "../enums";
import { AppLoggerSevice } from "../logger";

interface ErrorMessage {
	common?: string;
	unique?: string;
	foreign?: string;
}

export const handleError = (
	logger: AppLoggerSevice,
	error: any,
	messages: ErrorMessage,
) => {
	logger.error(error);
	if (
		error instanceof Prisma.PrismaClientKnownRequestError &&
		error.code == PrismaErrorCode.UniqueConstraintViolation &&
		messages.unique
	) {
		throw new BadRequestException(`${messages.unique}`);
	} else if (
		error instanceof Prisma.PrismaClientKnownRequestError &&
		error.code == PrismaErrorCode.ForeignKeyConstraintViolation &&
		messages.foreign
	) {
		throw new BadRequestException(`${messages.foreign}`);
	} else if (error.message && error instanceof HttpException) {
		throw new BadRequestException(error.message);
	}
	throw new BadRequestException(`${messages.common}`);
};
