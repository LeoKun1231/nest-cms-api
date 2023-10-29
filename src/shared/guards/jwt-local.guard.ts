import { StrategyEnum } from '@/shared/enums/strategy.enum';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtLocalGuard extends AuthGuard(StrategyEnum.LOCAL) {}
