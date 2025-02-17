import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User } from '../models/user_interface';
import { CreateUserDto } from '../dtos/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() user: CreateUserDto) {
    return await this.userService.create(user);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  // @Get(':id')
  // async findOne(@Param('id', ParseIntPipe) id: number) {
  //   return await this.userService.findOne(id);
  // }

  // @Patch(':id')
  // async update(@Param('id', ParseIntPipe) id: number, @Body() user: User) {
  //   return await this.userService.update(id, user);
  // }

  // @Delete(':id')
  // async delete(@Param('id', ParseIntPipe) id: number) {
  //   return await this.userService.delete(id);
  // }
}
