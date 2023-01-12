import { Exclude, Expose } from 'class-transformer';
import { Invoice } from '../../invoice/entities/invoice.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('company_recipients')
export class Recipient {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column()
  @Index()
  name: string;

  @Column({ type: 'text' })
  address: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column({ name: 'zip_code' })
  zipCode: string;

  @Column({ name: 'contact_name' })
  contactName: string;

  @Column({ name: 'contact_email' })
  contactEmail: string;

  @Column({ name: 'cc_emails', type: 'json' })
  ccEmails: string[];

  @Column({ name: 'user_id', nullable: true })
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  userId: number;

  @ManyToOne(() => User, (user) => user.recipients, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

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

  constructor(partial?: Partial<Recipient>) {
    Object.assign(this, partial);
  }
}
