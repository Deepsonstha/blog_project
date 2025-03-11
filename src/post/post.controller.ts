import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileValidationPipe } from 'src/core/validations/file_validation';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('postimage', {
      storage: diskStorage({
        destination: './uploads/post',
        filename: (req, file, cb) => {
          const filename =
            file.originalname.split('.')[0] +
            '-' +
            Date.now() +
            '.' +
            file.originalname.split('.')[1];
          cb(null, filename);
        },
      }),
    }),
  )
  async create(
    @UploadedFile(new FileValidationPipe()) postImage: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
  ) {
      if (postImage) {
          createPostDto.image = postImage.filename;
      }
    const post = await this.postService.create(createPostDto);

    return {
      message: 'Post created successfully',
      data: post,
    };
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
