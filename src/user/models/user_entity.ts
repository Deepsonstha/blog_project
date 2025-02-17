import { IsOptional } from 'class-validator';
import { ProfileEntity } from 'src/profile/entity/profile_entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => ProfileEntity, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @IsOptional()
  profile: ProfileEntity | null;
  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
