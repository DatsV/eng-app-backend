import { UpdatePassword } from './../user/dto/update-user.dto';
import { CreateUserDto } from './../user/dto/create-user.dto';
import { UserEntity } from './../user/entities/user.entity';
import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { comparePassword } from 'src/utils/bcrypt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async validateUser(email: string, passwordReq: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      const match = await comparePassword(passwordReq, user.password);
      if (match) {
        return user;
      } else {
        throw new UnauthorizedException(null, 'something incorrect');
      }
    }
    return null;
  }

  createJwtToken(user: { id: number; email: string; password: string }) {
    const slicePass = user.password.slice(-7);
    const payload = { email: user.email, sub: user.id, key: slicePass };
    return this.jwtService.sign(payload);
  }

  async login(userDto: UserEntity) {
    const { password, ...user } = userDto;

    return {
      user,
      engAppToken: this.createJwtToken(userDto),
    };
  }

  async register(dto: CreateUserDto) {
    try {
      const user = await this.userService.register(dto);
      const newToken = this.createJwtToken(user);

      const { password, ...resUser } = user;

      return {
        user: { ...resUser, words: 0 },
        engAppToken: newToken,
      };
    } catch (error) {
      throw new HttpException('Email already exist', HttpStatus.BAD_REQUEST);
    }
  }

  async sendConfirmMail(user: UserEntity) {
    try {
      const newToken = this.createJwtToken(user);
      await this.mailService.sendUserConfirmation(user, newToken);

      return new HttpException('success', 200);
    } catch (error) {
      throw new HttpException('Something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new HttpException('Can not find you', HttpStatus.NOT_FOUND);
    }

    try {
      const newToken = this.createJwtToken(user);
      await this.mailService.sendRecoverPassword(user, newToken);
      return new HttpException('success', 200);
    } catch (error) {
      throw new HttpException(
        'Oops.. please try later',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async changeUserPassword(userDto: UserEntity, dto: UpdatePassword) {
    const resPass = await this.userService.changePassword(userDto, dto);

    if (!resPass) {
      throw new HttpException(
        'Oops.. please try later',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = await this.createJwtToken({
      id: userDto.id,
      email: userDto.email,
      password: resPass,
    });

    const { password, ...user } = userDto;

    return {
      user,
      engAppToken: token,
    };
  }

  async getMe(userDto: UserEntity) {
    const res = await this.userService.findOneByEmail(userDto.email);

    const { password, ...user } = res;

    return {
      user,
      engAppToken: this.createJwtToken(userDto),
    };
  }
}
