import { CodeEntity } from './entities/code.entity';

import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateCodeDto } from './dto/create-code.dto';

@Injectable()
export class CodeService {
  constructor(
    @InjectRepository(CodeEntity)
    private repository: Repository<CodeEntity>,
    private userService: UserService,
    private authService: AuthService,
    @Inject(ConfigService)
    private readonly config: ConfigService,
  ) {}

  create(createCodeDto: CreateCodeDto, secret: string) {
    if (secret === this.config.get('CODE_SECRET')) {
      return this.repository.save({
        code: createCodeDto.code,
      });
    }
    throw new UnauthorizedException();
  }

  async findOneAndActivate(user: UserEntity, dto: CreateCodeDto) {
    if (user.isVip) {
      throw new HttpException('You are vip user', HttpStatus.BAD_REQUEST);
    }
    const isValid = await this.repository.findOne({
      where: { code: dto.code },
    });

    if (!isValid) {
      throw new HttpException('code not found', HttpStatus.NOT_FOUND);
    }

    await this.userService.update(user.id, { isVip: true });

    await this.authService.sendConfirmMail(user);

    return true;
  }

  findAll(secret: string) {
    if (secret === this.config.get('CODE_SECRET')) {
      return this.repository.find();
    }
    throw new UnauthorizedException();
  }

  remove(id: number, secret: string) {
    if (secret === this.config.get('CODE_SECRET')) {
      return this.repository.delete(id);
    }
    throw new UnauthorizedException();
  }
}
