import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  Generated,
} from 'typeorm';

@Entity('company_senders')
export class Sender {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Exclude()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ unique: true })
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ name: 'tax_number' })
  taxNumber: string;

  @Column({ name: 'checks_payable_to', nullable: true })
  checksPayableTo: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  constructor(partial?: Partial<Sender>) {
    Object.assign(this, partial);
  }

  @BeforeInsert()
  @BeforeUpdate()
  removeWhiteSpace() {
    this.phone = this.phone.replace(/\s+/g, '');
  }
}
