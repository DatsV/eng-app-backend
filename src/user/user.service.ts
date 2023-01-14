import { WordService } from './../word/word.service';
import { GroupDto } from './dto/group.dto';
import { UserEntity } from './entities/user.entity';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdatePassword } from './dto/update-user.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { generateHash } from 'src/utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
    @Inject(WordService)
    private wordService: WordService,
    @InjectDataSource()
    private dataSource: DataSource,
    @Inject(ConfigService)
    private readonly config: ConfigService,
  ) {}

  register(dto: CreateUserDto) {
    const passwordHash = generateHash(dto.password);
    return this.repository.save({
      email: dto.email,
      password: passwordHash,
    });
  }

  async findOneByEmail(email: string) {
    const user = await this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder('user')
      .where('user.email = :email ', { email })
      .addSelect('user.password')
      .loadRelationCountAndMap('user.words', 'user.words')
      .getOne();

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const res = await this.repository.update(id, updateUserDto);

    return res;
  }

  async changePassword(user: UserEntity, passwordDto: UpdatePassword) {
    try {
      const passwordHash = generateHash(passwordDto.password);
      await this.update(user.id, { password: passwordHash });
      return passwordHash;
    } catch (error) {
      return null;
    }
  }

  async activateUser(userDto: UserEntity) {
    try {
      await this.update(userDto.id, { isConfirm: true });

      userDto.isConfirm = true;
      const { password, ...user } = userDto;

      return {
        user,
      };
    } catch (error) {
      throw new HttpException('something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async addGroup(user: UserEntity, dto: GroupDto) {
    if (user.groups.includes(dto.group)) {
      throw new HttpException('group already exist', HttpStatus.BAD_REQUEST);
    }

    if ((!user.isConfirm || !user.isVip) && user.groups.length >= 2) {
      throw new HttpException('upgrade your status', HttpStatus.BAD_REQUEST);
    }

    const result = await this.dataSource
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        groups: () => `array_append("groups", '${dto.group}')`,
      })
      .where('id = :id', { id: user.id })
      .execute();

    return {
      group: dto.group,
    };
  }

  async removeGroup(user: UserEntity, group: string) {
    if (!user.groups.includes(group)) {
      throw new HttpException('group does not exist', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.dataSource
        .createQueryBuilder()
        .update(UserEntity)
        .set({
          groups: () => `array_remove("groups", '${group}')`,
        })
        .where('id = :id', { id: user.id })
        .execute();

      const wordsCount = await this.wordService.removeByGroup(user, group);

      return {
        group: group,
        wordsCount,
      };
    } catch (error) {
      throw new HttpException('something went wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async getAllInCount(code: string) {
    if (code === this.config.get('ADMIN_CODE')) {
      const result = await this.repository.count();

      return {
        message: `${result} users are currently registered`,
      };
    }

    throw new HttpException('access denied', HttpStatus.FORBIDDEN);
  }
}
