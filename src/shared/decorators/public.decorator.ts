import { SetMetadata } from "@nestjs/common";
import { DecoratorEnum } from "../enums/decorator.enum";

export const Public = () => SetMetadata(DecoratorEnum.IS_PUBLIC, true);
