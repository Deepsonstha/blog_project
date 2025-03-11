import { Category } from 'src/categories/entities/category.entity';
import { UserEntity } from 'src/user/models/user_entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ nullable: true })
  subtitle?: string;

  @Column({ nullable: true })
  image?: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Many posts belong to one category
  @ManyToOne(() => Category, (category) => category.posts, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category?: Category;

  // Many posts belong to one user (author)
  @ManyToOne(() => UserEntity, (user) => user.post, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  author: UserEntity;
}
