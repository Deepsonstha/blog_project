import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../models/user_interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { identity } from 'rxjs';
import { UpdateUserDTO } from '../dtos/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: CreateUserDto) {
    const newuser = await this.userService.create(user);
    return {
      message: 'User created successfully',
      user: newuser,
    };
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('find')
  async findOne(@Query('identifier') identifier: string) {
    const user = await this.userService.findOne(
      isNaN(Number(identifier)) ? identifier : Number(identifier),
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDTO,
  ) {
    return await this.userService.update(id, user);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.deleteUser(id);
  }
}
