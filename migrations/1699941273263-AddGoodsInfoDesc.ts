import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGoodsInfoDesc1699941273263 implements MigrationInterface {
	name = "AddGoodsInfoDesc1699941273263";

	public async up(queryRunner: QueryRunner): Promise<void> {
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
            ALTER TABLE \`goods_category\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`goods_category\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
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
            ALTER TABLE \`goods_category\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`goods_category\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP
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
	}
}