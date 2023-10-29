/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-17 17:08:57
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-21 20:34:57
 * @FilePath: \cms\src\modules\users\users.service.ts
 * @Description:
 */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AppLoggerSevice } from '@/shared/logger/logger.service';
import { Repository } from 'typeorm';
import { Users } from '@/shared/entities/Users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { hash, compare } from 'bcrypt';
import { ExportUserDto } from './dtos/export-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly logger: AppLoggerSevice,
    @InjectRepository(Users)
    private readonly usersRespository: Repository<Users>,
  ) {
    this.logger.setContext(UsersService.name);
  }

  /**
   * 验证用户
   * @param name 用户名
   * @param password 密码
   * @returns
   */
  async validateUser(name: string, password: string): Promise<Users> {
    this.logger.log(`${this.validateUser.name} was called`);
    this.logger.log(
      `calling usersRespository.findOne name: ${name} password: ${password}`,
    );
    //查找用户
    const user = await this.usersRespository.findOne({ where: { name } });
    //判断用户是否存在
    if (!user) throw new UnauthorizedException('用户不存在');

    //判断密码是否正确
    const isPasswordValid = await compare(password, user.password);

    //密码不正确
    if (!isPasswordValid) throw new UnauthorizedException('账号或密码错误');

    //判断用户是否被禁用
    if (!user.enable) throw new UnauthorizedException('用户被禁用');

    return plainToClass(Users, user);
  }

  /**
   * 创建用户
   * @param name 用户名
   * @param password 密码
   * @returns
   */
  async createUser(name: string, password: string) {
    this.logger.log(`${this.createUser.name} was called`);
    this.logger.log(
      `calling usersRespository.findOne name: ${name} password: ${password}`,
    );
    try {
      const hashPassword = await hash(password, 10);
      const res = await this.usersRespository.save({
        name,
        password: hashPassword,
      });
      return plainToClass(ExportUserDto, res, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('该用户已存在');
    }
  }

  /**
   * 根据id查找用户
   * @param id 用户id
   * @returns
   */
  async findUserById(id: string) {
    this.logger.log(`${this.findUserById.name} was called`);
    this.logger.log(`calling usersRespository.findOne id: ${id}`);
    try {
      const res = await this.usersRespository.findOne({ where: { id } });
      if (!res) throw new BadRequestException('该用户不存在');
      return plainToClass(ExportUserDto, res, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('该用户不存在');
    }
  }
}
