/*
 * @Author: Leo l024983409@qq.com
 * @Date: 2023-10-17 12:53:01
 * @LastEditors: Leo l024983409@qq.com
 * @LastEditTime: 2023-11-14 12:31:25
 * @FilePath: \cms\src\swagger.ts
 * @Description:
 */
import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setupSwagger(app: INestApplication<any>) {
	const options = new DocumentBuilder()
		.addBearerAuth()
		.setTitle("CMS_BACKEND")
		.setDescription("The CMS_BACKEND API description")
		.setVersion("1.0")
		.addServer("/api/v1")
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup("swagger", app, document, {
		jsonDocumentUrl: "/api/v1/swagger-json",
	});
}
