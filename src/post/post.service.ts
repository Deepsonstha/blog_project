import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { UserEntity } from 'src/user/models/user_entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async create(createPostDto: CreatePostDto) {
    const user = await this.userRepository.findOne({
      where: { id: createPostDto.authorId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    } else {
    }
    const category = await this.categoryRepository.findOne({
      where: { id: createPostDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (user && category) {
      const post = await this.postRepository.create({
        author: user,
        category: category,
        ...createPostDto,
      });
      return await this.postRepository.save(post);
    }
  }

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
