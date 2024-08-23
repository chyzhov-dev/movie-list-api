import { UserEntity } from '@modules/users/transformers/users.transformer';
import { Transform } from 'class-transformer';

export class MovieEntity {
  id: number;

  title: string;

  year: number;

  @Transform(({ value }) => value.id)
  user: UserEntity;

  poster: string;

  constructor(partial: Partial<MovieEntity>) {
    Object.assign(this, partial);
  }
}
