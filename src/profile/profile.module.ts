import { Module } from '@nestjs/common';
import { ProfileController } from './controller/profile.controller';
import { ProfileService } from './service/profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileEntity } from './entity/profile_entity';
import { UserEntity } from 'src/user/models/user_entity';
import { UserService } from 'src/user/service/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileEntity, UserEntity]), UserModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
