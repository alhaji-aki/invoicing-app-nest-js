import { Exclude, Expose } from 'class-transformer';
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
  OneToMany,
} from 'typeorm';
import { InvoiceLine } from './invoice-line.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ unique: true, name: 'invoice_no' })
  invoiceNo: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ name: 'sender_id', nullable: true })
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  senderId: number;

  @ManyToOne(() => Sender, (sender) => sender.invoices, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'sender_id' })
  sender: Sender;

  @Column({ name: 'recipient_id', nullable: true })
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  recipientId: number;

  @ManyToOne(() => Recipient, (recipient) => recipient.invoices, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'recipient_id' })
  recipient: Recipient;

  @OneToMany(() => InvoiceLine, (invoiceLine) => invoiceLine.invoice)
  invoiceLines: InvoiceLine[];

  @Column({ type: 'bigint', unsigned: true, default: 0 })
  amount: number;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ name: 'sent_status', default: 'none' })
  sentStatus: string;

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
