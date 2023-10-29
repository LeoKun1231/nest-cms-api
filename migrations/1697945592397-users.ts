import { MigrationInterface, QueryRunner } from "typeorm";

export class Users1697945592397 implements MigrationInterface {
    name = 'Users1697945592397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` varchar(36) NOT NULL,
                \`createAt\` timestamp(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(0),
                \`updateAt\` timestamp(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0),
                \`name\` varchar(255) NOT NULL COMMENT '用户名',
                \`realname\` varchar(255) NULL COMMENT '真实姓名',
                \`password\` varchar(255) NOT NULL COMMENT '密码',
                \`cellphone\` int NULL COMMENT '手机号码',
                \`enable\` tinyint NOT NULL COMMENT '是否启用 0:禁用 1:启用' DEFAULT '1',
                UNIQUE INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX \`IDX_51b8b26ac168fbe7d6f5653e6c\` ON \`users\`
        `);
        await queryRunner.query(`
            DROP TABLE \`users\`
        `);
    }

}
