import { Invoice } from '../../invoice/entities/invoice.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  OneToMany,
} from 'typeorm';

@Entity('company_recipients')
export class Recipient {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'text' })
  address: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column({ name: 'zip_code' })
  zipCode: string;

  @Column({ name: 'contact_email' })
  contactEmail: string;

  @Column({ name: 'cc_emails', type: 'json' })
  ccEmails: Record<string, any>;

  @OneToMany(() => Invoice, (invoice) => invoice.recipient)
  invoices: Invoice[];

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
}
