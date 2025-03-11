import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './models/user_entity';
import { AuthModule } from 'src/auth/auth.module';
import { ProfileEntity } from 'src/profile/entity/profile_entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ProfileEntity]), AuthModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
