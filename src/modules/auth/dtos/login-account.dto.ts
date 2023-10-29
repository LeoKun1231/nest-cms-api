import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginAccountDto {
  @ApiProperty({ description: '用户名', type: String })
  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须是字符串' })
  @MaxLength(32, { message: '用户名长度不能超过32个字符' })
  name: string;

  @ApiProperty({ description: '密码', type: String })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须是字符串' })
  password: string;
}
