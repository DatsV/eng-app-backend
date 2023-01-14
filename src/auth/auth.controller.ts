import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { UpdatePassword } from 'src/user/dto/update-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateUserDto } from './../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@User() user: UserEntity) {
    return this.authService.getMe(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('resend')
  resendConfirmMail(@User() user: UserEntity) {
    return this.authService.sendConfirmMail(user);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('recover')
  changePassword(@User() user: UserEntity, @Body() dto: UpdatePassword) {
    return this.authService.changeUserPassword(user, dto);
  }

  @HttpCode(200)
  @Post('forgotpassword')
  async forgotPassword(@Body() dto: Pick<CreateUserDto, 'email'>) {
    return this.authService.forgotPassword(dto.email);
  }
}
