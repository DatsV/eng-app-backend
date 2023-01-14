import { IsEmail, Length } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';

export class CreateUserDto {
  @IsEmail(undefined, { message: 'Incorrect Email' })
  email: string;

  @Length(6, 30, { message: 'Password must be more than 6 characters' })
  password: string;

  @Length(6, 30, { message: 'Password must be more than 6 characters' })
  @Match('password', { message: 'Password not match' })
  passwordConfirm: string;
}
