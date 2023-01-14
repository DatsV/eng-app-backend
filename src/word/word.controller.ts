import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateWordDto } from './dto/create-word.dto';
import { SearchWordDto } from './dto/search-word.dto';
import { WordService } from './word.service';

@Controller('word')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  addWord(@User() user: UserEntity, @Body() createWordDto: CreateWordDto) {
    return this.wordService.addWord(user, createWordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findByGroup(@User() user: UserEntity, @Query('group') group: string) {
    return this.wordService.findByGroup(user, group);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/search')
  search(@User() user: UserEntity, @Query() search: SearchWordDto) {
    return this.wordService.search(user, search);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeWord(@User() user: UserEntity, @Param('id') id: string) {
    return this.wordService.removeWord(user, id);
  }

  @Get('admin/:code')
  getAllInCount(@Param('code') code: string) {
    return this.wordService.getAllInCount(code);
  }
}
