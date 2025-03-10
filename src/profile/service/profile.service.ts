import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfileEntity } from '../entity/profile_entity';
import { UserEntity } from 'src/user/models/user_entity';
import { CreateProfileDto } from '../dto/create_profile_dto';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profilerepository: Repository<ProfileEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async updateProfile(userId: number, profileDto: CreateProfileDto) {
    const userExists = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const existingProfile = await this.profilerepository.findOne({
      where: { user: { id: userId } },
    });

    if (existingProfile) {
      const updatedProfile = this.profilerepository.merge(
        existingProfile,
        profileDto,
      );
      return await this.profilerepository.save(updatedProfile);
    }

    const newProfile = this.profilerepository.create({
      ...profileDto,
      user: userExists,
    });

    return await this.profilerepository.save(newProfile);
  }
}
