import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsNotEmpty()
  @IsString({
    message: 'Content is required',
  })
  description: string;

  @IsOptional()
  image?: string;

  @IsNotEmpty()
  categoryId?: number; // Optional, since a post may not have a category

  @IsNotEmpty()
  authorId: number; // Required, as every post needs an author
}
