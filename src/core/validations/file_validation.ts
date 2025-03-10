import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
  private readonly ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

  transform(value: any, metadata: ArgumentMetadata) {
    const { size, mimetype, originalname } = value;

    // Validate file size
    if (size > this.MAX_FILE_SIZE) {
      throw new BadRequestException('File size exceeds the 5MB limit');
    }

    // Validate file type
    if (!this.ALLOWED_TYPES.includes(mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only images are allowed.',
      );
    }

    // Validate file extension
    const extension = originalname
      .slice(((originalname.lastIndexOf('.') - 1) >>> 0) + 2)
      .toLowerCase();
    if (!this.ALLOWED_EXTENSIONS.includes(`.${extension}`)) {
      throw new BadRequestException(
        'Invalid file extension. Only .jpg, .jpeg, and .png are allowed.',
      );
    }

    return value;
  }
}
