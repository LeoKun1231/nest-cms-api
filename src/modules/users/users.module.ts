/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-17 17:08:57
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-18 10:15:43
 * @FilePath: \cms\src\modules\users\users.module.ts
 * @Description:
 */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '@/shared/entities/Users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
