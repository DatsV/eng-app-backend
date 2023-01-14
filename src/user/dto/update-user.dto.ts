import { PartialType } from '@nestjs/mapped-types';
import { Length } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  password?: string;
  isVip?: boolean;
  isConfirm?: boolean;
}

export class UpdatePassword {
  @Length(6, 30, { message: 'Password must be more than 6 characters' })
  password: string;

  @Length(6, 30, { message: 'Password must be more than 6 characters' })
  @Match('password', { message: 'Password not match' })
  passwordConfirm: string;
}
