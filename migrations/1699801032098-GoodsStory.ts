import { MigrationInterface, QueryRunner } from "typeorm";

export class GoodsStory1699801032098 implements MigrationInterface {
	name = "GoodsStory1699801032098";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            CREATE TABLE \`goods_category\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(0),
                \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
                \`isDelete\` tinyint NOT NULL COMMENT '是否删除' DEFAULT 0,
                \`enable\` tinyint NOT NULL COMMENT '是否启用' DEFAULT 1,
                \`name\` varchar(50) NOT NULL COMMENT '商品分类名',
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
		await queryRunner.query(`
            ALTER TABLE \`menu\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`menu\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`role\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`role\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`department\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`department\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`goods_info\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`goods_info\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`story\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`story\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            ALTER TABLE \`story\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`story\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`goods_info\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`goods_info\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`department\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`department\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`role\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`role\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`menu\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`menu\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            DROP TABLE \`goods_category\`
        `);
	}
}
