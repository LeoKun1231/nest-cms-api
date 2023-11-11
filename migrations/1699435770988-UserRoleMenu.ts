import { MigrationInterface, QueryRunner } from "typeorm";

export class UserRoleMenu1699435770988 implements MigrationInterface {
	name = "UserRoleMenu1699435770988";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(0),
                \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
                \`isDelete\` tinyint NOT NULL COMMENT '是否删除' DEFAULT 0,
                \`enable\` tinyint NOT NULL COMMENT '是否启用' DEFAULT 1,
                \`name\` varchar(255) NOT NULL COMMENT '用户名',
                \`realname\` varchar(255) NULL COMMENT '真实姓名',
                \`password\` varchar(255) NOT NULL COMMENT '密码',
                \`cellphone\` int NULL COMMENT '手机号码',
                UNIQUE INDEX \`IDX_065d4d8f3b5adb4a08841eae3c\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
		await queryRunner.query(`
            CREATE TABLE \`role\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(0),
                \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
                \`isDelete\` tinyint NOT NULL COMMENT '是否删除' DEFAULT 0,
                \`enable\` tinyint NOT NULL COMMENT '是否启用' DEFAULT 1,
                \`name\` varchar(255) NOT NULL COMMENT '角色名',
                \`intro\` varchar(255) NULL COMMENT '角色描述',
                UNIQUE INDEX \`IDX_ae4578dcaed5adff96595e6166\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
		await queryRunner.query(`
            CREATE TABLE \`menu\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(0),
                \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
                \`isDelete\` tinyint NOT NULL COMMENT '是否删除' DEFAULT 0,
                \`enable\` tinyint NOT NULL COMMENT '是否启用' DEFAULT 1,
                \`parentId\` int NULL COMMENT '父级id',
                \`name\` varchar(255) NOT NULL COMMENT '菜单名称',
                \`type\` int NOT NULL COMMENT '菜单层级',
                \`url\` varchar(255) NULL COMMENT '菜单路径',
                \`icon\` varchar(255) NULL COMMENT '菜单图标',
                \`sort\` int NULL COMMENT '菜单排序',
                \`permission\` varchar(255) NULL COMMENT '菜单权限',
                \`mpath\` varchar(255) NULL DEFAULT '',
                UNIQUE INDEX \`IDX_51b63874cdce0d6898a0b2150f\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
		await queryRunner.query(`
            CREATE TABLE \`user_role\` (
                \`userId\` int NOT NULL,
                \`roleId\` int NOT NULL,
                INDEX \`IDX_ab40a6f0cd7d3ebfcce082131f\` (\`userId\`),
                INDEX \`IDX_dba55ed826ef26b5b22bd39409\` (\`roleId\`),
                PRIMARY KEY (\`userId\`, \`roleId\`)
            ) ENGINE = InnoDB
        `);
		await queryRunner.query(`
            CREATE TABLE \`role_menu\` (
                \`menuId\` int NOT NULL,
                \`roleId\` int NOT NULL,
                INDEX \`IDX_ed7dbf72cc845b0c9150a67851\` (\`menuId\`),
                INDEX \`IDX_4a57845f090fb832eeac3e3486\` (\`roleId\`),
                PRIMARY KEY (\`menuId\`, \`roleId\`)
            ) ENGINE = InnoDB
        `);
		await queryRunner.query(`
            ALTER TABLE \`menu\`
            ADD CONSTRAINT \`FK_23ac1b81a7bfb85b14e86bd23a5\` FOREIGN KEY (\`parentId\`) REFERENCES \`menu\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
		await queryRunner.query(`
            ALTER TABLE \`user_role\`
            ADD CONSTRAINT \`FK_ab40a6f0cd7d3ebfcce082131fd\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
		await queryRunner.query(`
            ALTER TABLE \`user_role\`
            ADD CONSTRAINT \`FK_dba55ed826ef26b5b22bd39409b\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
		await queryRunner.query(`
            ALTER TABLE \`role_menu\`
            ADD CONSTRAINT \`FK_ed7dbf72cc845b0c9150a678512\` FOREIGN KEY (\`menuId\`) REFERENCES \`menu\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
		await queryRunner.query(`
            ALTER TABLE \`role_menu\`
            ADD CONSTRAINT \`FK_4a57845f090fb832eeac3e34860\` FOREIGN KEY (\`roleId\`) REFERENCES \`role\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            ALTER TABLE \`role_menu\` DROP FOREIGN KEY \`FK_4a57845f090fb832eeac3e34860\`
        `);
		await queryRunner.query(`
            ALTER TABLE \`role_menu\` DROP FOREIGN KEY \`FK_ed7dbf72cc845b0c9150a678512\`
        `);
		await queryRunner.query(`
            ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_dba55ed826ef26b5b22bd39409b\`
        `);
		await queryRunner.query(`
            ALTER TABLE \`user_role\` DROP FOREIGN KEY \`FK_ab40a6f0cd7d3ebfcce082131fd\`
        `);
		await queryRunner.query(`
            ALTER TABLE \`menu\` DROP FOREIGN KEY \`FK_23ac1b81a7bfb85b14e86bd23a5\`
        `);
		await queryRunner.query(`
            DROP INDEX \`IDX_4a57845f090fb832eeac3e3486\` ON \`role_menu\`
        `);
		await queryRunner.query(`
            DROP INDEX \`IDX_ed7dbf72cc845b0c9150a67851\` ON \`role_menu\`
        `);
		await queryRunner.query(`
            DROP TABLE \`role_menu\`
        `);
		await queryRunner.query(`
            DROP INDEX \`IDX_dba55ed826ef26b5b22bd39409\` ON \`user_role\`
        `);
		await queryRunner.query(`
            DROP INDEX \`IDX_ab40a6f0cd7d3ebfcce082131f\` ON \`user_role\`
        `);
		await queryRunner.query(`
            DROP TABLE \`user_role\`
        `);
		await queryRunner.query(`
            DROP INDEX \`IDX_51b63874cdce0d6898a0b2150f\` ON \`menu\`
        `);
		await queryRunner.query(`
            DROP TABLE \`menu\`
        `);
		await queryRunner.query(`
            DROP INDEX \`IDX_ae4578dcaed5adff96595e6166\` ON \`role\`
        `);
		await queryRunner.query(`
            DROP TABLE \`role\`
        `);
		await queryRunner.query(`
            DROP INDEX \`IDX_065d4d8f3b5adb4a08841eae3c\` ON \`user\`
        `);
		await queryRunner.query(`
            DROP TABLE \`user\`
        `);
	}
}