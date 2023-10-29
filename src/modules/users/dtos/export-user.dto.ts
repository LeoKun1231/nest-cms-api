import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ExportUserDto {
  @ApiProperty({
    description: '用户ID',
    example: '1',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: '用户名',
    example: 'John Doe',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: '真实姓名',
    example: 'John Smith',
  })
  @Expose()
  realname: string;

  @ApiProperty({
    description: '手机号码',
    example: '1234567890',
  })
  @Expose()
  cellphone: number;

  @ApiProperty({
    description: '用户是否启用',
    example: '1',
  })
  @Expose()
  enable: number;

  @ApiProperty({
    description: '用户创建时间',
    example: '2022-01-01 00:00:00',
  })
  @Expose()
  createAt: Date;

  @ApiProperty({
    description: '用户最后更新时间',
    example: '2022-01-01T00:00:00',
  })
  @Expose()
  updateAt: Date;
}
