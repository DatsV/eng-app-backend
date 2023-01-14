import { UserEntity } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CodeService } from './code.service';
import { CreateCodeDto } from './dto/create-code.dto';
import { User } from 'src/decorators/user.decorator';

@Controller('code')
export class CodeController {
  constructor(private readonly codeService: CodeService) {}

  @Post()
  create(
    @Body() createCodeDto: CreateCodeDto,
    @Query('secret') secret: string,
  ) {
    return this.codeService.create(createCodeDto, secret);
  }

  @UseGuards(JwtAuthGuard)
  @Post('activate')
  activateCode(@User() user: UserEntity, @Body() dto: CreateCodeDto) {
    return this.codeService.findOneAndActivate(user, dto);
  }

  @Get()
  findOne(@Query('secret') secret: string) {
    return this.codeService.findAll(secret);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('secret') secret: string) {
    return this.codeService.remove(+id, secret);
  }
}
