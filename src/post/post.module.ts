import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Category } from 'src/categories/entities/category.entity';
import { UserModule } from 'src/user/user.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { UserEntity } from 'src/user/models/user_entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Category, UserEntity]),
    UserModule,
    CategoriesModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
