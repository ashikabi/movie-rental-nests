import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserStatus } from './user-status.enum';

@Entity()
export class User extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  password: string;
  @Column()
  role: string;
  @Column()
  status: UserStatus
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  created: Date;

}