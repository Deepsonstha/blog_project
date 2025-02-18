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
  async createProfile(userId: number, profileDto: CreateProfileDto) {
    const userExists = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    // Check if a profile already exists for the user
    const existingProfile = await this.profilerepository.findOne({
      where: { user: { id: userId } },
    });

    if (existingProfile) {
      throw new BadRequestException('User already has a profile');
    }

    // Create and save the profile
    const newProfile = this.profilerepository.create({
      ...profileDto,
      user: userExists,
    });

    return await this.profilerepository.save(newProfile);
  }
}
