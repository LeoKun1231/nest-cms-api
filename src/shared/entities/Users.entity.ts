/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-17 19:27:23
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-18 17:26:56
 * @FilePath: \cms\src\entity\Users.entity.ts
 * @Description:
 */
import { Column, Entity } from 'typeorm';
import { BaseTimeEntity } from './base/BaseTime.entity';

@Entity('users')
export class Users extends BaseTimeEntity {
  @Column({ unique: true, comment: '用户名' })
  name: string;

  @Column({ comment: '真实姓名', nullable: true })
  realname: string;

  @Column({ comment: '密码' })
  password: string;

  @Column({ comment: '手机号码', nullable: true })
  cellphone: number;

  @Column({
    type: 'tinyint',
    comment: '是否启用 0:禁用 1:启用',
    default: 1,
  })
  enable: number;
}
