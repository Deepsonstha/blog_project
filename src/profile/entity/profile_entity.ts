import { UserEntity } from 'src/user/models/user_entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProfileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  profileImage: string;

  @Column()
  bio: string;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.profile)
  user: UserEntity;
}
