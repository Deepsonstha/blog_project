import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';

import { UserEntity } from '../models/user_entity';
import { AuthService } from 'src/auth/service/auth.service';
import { User } from '../models/user_interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateUserDTO } from '../dtos/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async create(user: CreateUserDto): Promise<Partial<User>> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: {
          email: user.email,
        },
      });

      if (existingUser) {
        throw new BadRequestException('Username or email already exists');
      }

      const hashPassword = await this.authService.hashPassword(user.password);

      const newUser = this.userRepository.create(
        Object.assign(user, { password: hashPassword }),
      );

      const savedUser = await this.userRepository.save(newUser);

      const { password, ...result } = savedUser;
      console.log('save user ::', { result });

      return result;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async findOne(identifier: string | number): Promise<User | null> {
    const whereCondition: FindOptionsWhere<User> = {};

    if (typeof identifier === 'number') {
      whereCondition.id = identifier;
    } else {
      whereCondition.email = identifier;
    }

    const user = await this.userRepository.findOne({
      where: whereCondition,
    });
    return plainToInstance(UserEntity, user);
  }

  async findAll(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find();
    return plainToInstance(UserEntity, users);
  }

  async deleteUser(id: number) {
    try {
      const deletedUser = await this.userRepository.delete(id);
      console.log('deletedUser ::', deletedUser);
      if (deletedUser.affected === 0) {
        throw new NotFoundException('User not found');
      }

      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updateUser: UpdateUserDTO) {
    try {
      const user = await this.findOne(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
      Object.assign(user, updateUser);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
