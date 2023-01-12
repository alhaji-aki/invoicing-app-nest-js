import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('invites')
export class Invite {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  id: number;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Column()
  @Index()
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  token: string;

  @Column({ name: 'invited_by_id', nullable: true })
  @Exclude({ toPlainOnly: true })
  @Expose({ toClassOnly: true })
  invitedById: number;

  @ManyToOne(() => User, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'invited_by_id' })
  invitedBy: User;

  @Column({ nullable: true, type: 'timestamp', name: 'accepted_at' })
  acceptedAt?: Date;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    name: 'deleted_at',
  })
  deletedAt: Date;

  constructor(partial?: Partial<Invite>) {
    Object.assign(this, partial);
  }
}
