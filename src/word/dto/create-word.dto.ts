import { IsString, Length } from 'class-validator';

export class CreateWordDto {
  @Length(2, 40)
  eng: string;

  @Length(2, 40)
  nat: string;

  group: string;
}
