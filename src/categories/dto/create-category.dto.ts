import { IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString({
    message: 'Title is required',
  })
  title: string;

  @IsOptional()
  @IsString()
  content: string;
}
