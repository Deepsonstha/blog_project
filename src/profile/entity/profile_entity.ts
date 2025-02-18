import { UserEntity } from 'src/user/models/user_entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'profiles',
})
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: true,
  })
  profilePicture: string;

  @Column({ nullable: true })
  bio: string;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.profile)
  user: UserEntity;
}
