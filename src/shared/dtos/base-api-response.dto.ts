/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-18 20:15:14
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-10-19 12:51:51
 * @FilePath: \cms\src\shared\dtos\base-api-response.dto.ts
 * @Description:
 */
import { ApiProperty } from '@nestjs/swagger';

export class BaseApiResponse<T> {
  data: T; // Swagger Decorator is added in the extended class below, since that will override this one.
  code: number;
  message: string;
}

export function SwaggerBaseApiResponse<T>(type: T): typeof BaseApiResponse {
  class ExtendedBaseApiResponse<T> extends BaseApiResponse<T> {
    @ApiProperty({ type })
    public data: T;
    @ApiProperty({ type: Number })
    public code: number;
    @ApiProperty({ type: String })
    public message: string;
  }

  const isAnArray = Array.isArray(type) ? ' [ ] ' : '';
  Object.defineProperty(ExtendedBaseApiResponse, 'name', {
    value: `${isAnArray}`,
  });

  return ExtendedBaseApiResponse;
}

export class BaseApiErrorResponse {
  @ApiProperty({ type: Number })
  public code: number;

  @ApiProperty({ type: String })
  public message: string;

  @ApiProperty({ type: String })
  public path: string;
  @ApiProperty({ type: String })
  public timestamp: string;
}
