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

import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'User',
})
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

  @Column({
    select: false,
  })
  @Exclude()
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

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 12);
  }
}
