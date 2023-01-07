import { Exclude } from 'class-transformer';
import { Recipient } from '../../company/entities/recipient.entity';
import { Sender } from '../../company/entities/sender.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Exclude()
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ unique: true, name: 'invoice_no' })
  invoiceNo: string;

  @ManyToOne(() => Sender, (sender) => sender.invoices, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'sender_id' })
  sender: Sender;

  @ManyToOne(() => Recipient, (recipient) => recipient.invoices, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'recipient_id' })
  recipient: Recipient;

  @Column({ type: 'bigint', unsigned: true, default: 0 })
  amount: number;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date;

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

  constructor(partial?: Partial<Invoice>) {
    Object.assign(this, partial);
  }
}