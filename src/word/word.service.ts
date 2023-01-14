import { UserEntity } from './../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateWordDto } from './dto/create-word.dto';
import { WordEntity } from './entities/word.entity';
import { SearchWordDto } from './dto/search-word.dto';

@Injectable()
export class WordService {
  constructor(
    @InjectRepository(WordEntity)
    private repository: Repository<WordEntity>,
    @InjectDataSource()
    private dataSource: DataSource,
    @Inject(ConfigService)
    private readonly config: ConfigService,
  ) {}

  addWord(user: UserEntity, dto: CreateWordDto) {
    if (
      (!user.isVip || !user.isConfirm) &&
      typeof user.words == 'number' &&
      user.words >= 20
    ) {
      throw new HttpException('Your limit reached', HttpStatus.BAD_REQUEST);
    }

    if (
      (user.isVip || user.isConfirm) &&
      typeof user.words == 'number' &&
      user.words >= 1000
    ) {
      throw new HttpException('Your limit reached', HttpStatus.BAD_REQUEST);
    }

    if (!user.groups.includes(dto.group)) {
      throw new HttpException('group does not exist', HttpStatus.BAD_REQUEST);
    }

    return this.repository.save({
      ...dto,
      user: { id: user.id },
    });
  }

  async search(user: UserEntity, dto: SearchWordDto) {
    const res = await this.repository
      .createQueryBuilder('word')
      .setParameters({
        text: `%${dto.text}%`,
        group: `%${dto.group}%`,
      })
      .leftJoinAndSelect('word.user', 'user')
      .where('user.id = :id', { id: user.id })
      .andWhere('word.group ILIKE :group')
      .andWhere('word.eng ILIKE :text')
      .getMany();

    return res;
  }

  removeWord(user: UserEntity, id: string) {
    return this.repository.delete({ user: { id: user.id }, id });
  }

  async findByGroup(user: UserEntity, group?: string) {
    let searchGroup = group || undefined;

    const result = await this.repository.find({
      where: { user: { id: user.id }, group: searchGroup },
      order: { createdAt: 'ASC' },
    });

    return result;
  }

  async removeByGroup(user: UserEntity, group: string) {
    const result = await this.repository.delete({
      user: { id: user.id },
      group: group,
    });

    return result.affected;
  }

  async getAllInCount(code: string) {
    if (code === this.config.get('ADMIN_CODE')) {
      const result = await this.repository.count();

      return {
        message: `${result} words are currently registered`,
      };
    }

    throw new HttpException('access denied', HttpStatus.FORBIDDEN);
  }
}
