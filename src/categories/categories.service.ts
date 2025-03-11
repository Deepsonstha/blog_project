import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  @InjectRepository(Category)
  private readonly categoryRepository: Repository<Category>;
  constructor() {}
  async create(createCategoryDto: CreateCategoryDto) {
    const exitCategory = await this.categoryRepository.findOne({
      where: { title: createCategoryDto.title },
    });

    if (exitCategory) {
      throw new NotFoundException('Category already exist');
    }
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: number) {
    return await this.categoryRepository.findOne({
      where: { id: id },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: { id: id },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.categoryRepository.delete(id);
    if (category.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return { message: 'Category has been deleted successfully' };
  }
}
