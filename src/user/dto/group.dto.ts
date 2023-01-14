import { Length } from 'class-validator';

export class GroupDto {
  @Length(1, 20, { message: 'Too long name' })
  group: string;
}
