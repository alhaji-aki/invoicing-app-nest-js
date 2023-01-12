import { Exclude, Expose } from 'class-transformer';
import { Recipient } from 'src/company/entities/recipient.entity';
import { Sender } from 'src/company/entities/sender.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  password: string;

  @Column({ name: 'is_admin', type: 'boolean', default: false })
  isAdmin: boolean;

  @OneToMany(() => Sender, (sender) => sender.user)
  senders: Sender[];

  @OneToMany(() => Recipient, (recipient) => recipient.user)
  recipients: Recipient[];

  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices: Recipient[];

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

  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }
}
