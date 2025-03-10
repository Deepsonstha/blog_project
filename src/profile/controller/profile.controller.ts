import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from '../service/profile.service';
import { CreateProfileDto } from '../dto/create_profile_dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileValidationPipe } from 'src/core/validations/file_validation';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post(':id')
  @UseInterceptors(
    FileInterceptor('profile', {
      storage: diskStorage({
        destination: './uploads/profile',
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
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() profile: CreateProfileDto,
    @UploadedFile(new FileValidationPipe()) profileImage: Express.Multer.File,
  ) {
    if (profileImage) {
      profile.profilePicture = profileImage.filename;
    }

    return await this.profileService.updateProfile(id, profile);
  }
}
