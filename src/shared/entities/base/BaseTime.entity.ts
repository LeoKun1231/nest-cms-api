import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    comment: '创建时间',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(0)',
    precision: 0,
  })
  createAt: Date;

  @UpdateDateColumn({
    comment: '更新时间',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(0)',
    onUpdate: 'CURRENT_TIMESTAMP(0)',
    precision: 0,
  })
  updateAt: Date;
}
