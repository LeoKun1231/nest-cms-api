import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDepartment1699507403771 implements MigrationInterface {
	name = "AddDepartment1699507403771";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            CREATE TABLE \`department\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(0),
                \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
                \`isDelete\` tinyint NOT NULL COMMENT '是否删除' DEFAULT 0,
                \`enable\` tinyint NOT NULL COMMENT '是否启用' DEFAULT 1,
                \`name\` varchar(50) NOT NULL COMMENT '部门名称',
                \`leader\` varchar(50) NOT NULL COMMENT '部门领导',
                \`parentId\` int NULL COMMENT '父级id',
                \`mpath\` varchar(255) NULL DEFAULT '',
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
		await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`role\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`role\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`menu\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`menu\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`department\`
            ADD CONSTRAINT \`FK_c50480cad914f9afa0c5213c76c\` FOREIGN KEY (\`parentId\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            ALTER TABLE \`department\` DROP FOREIGN KEY \`FK_c50480cad914f9afa0c5213c76c\`
        `);
		await queryRunner.query(`
            ALTER TABLE \`menu\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`menu\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`role\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`role\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            DROP TABLE \`department\`
        `);
	}
}
