import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { GroupDto } from './dto/group.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('activate')
  activateUser(@User() user: UserEntity) {
    return this.userService.activateUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('group')
  addGroup(@User() user: UserEntity, @Body() dto: GroupDto) {
    return this.userService.addGroup(user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('group/:group')
  removeGroup(@User() user: UserEntity, @Param('group') group: string) {
    return this.userService.removeGroup(user, group);
  }

  @Get('admin/:code')
  getAllInCount(@Param('code') code: string) {
    return this.userService.getAllInCount(code);
  }
}
