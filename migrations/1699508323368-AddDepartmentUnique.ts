import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDepartmentUnique1699508323368 implements MigrationInterface {
	name = "AddDepartmentUnique1699508323368";

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
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
            ALTER TABLE \`department\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`department\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
        `);
		await queryRunner.query(`
            ALTER TABLE \`department\`
            ADD UNIQUE INDEX \`IDX_471da4b90e96c1ebe0af221e07\` (\`name\`)
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
            ALTER TABLE \`department\` DROP INDEX \`IDX_471da4b90e96c1ebe0af221e07\`
        `);
		await queryRunner.query(`
            ALTER TABLE \`department\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`department\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP
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
            ALTER TABLE \`user\` CHANGE \`updateAt\` \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        `);
		await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`createAt\` \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP
        `);
	}
}
