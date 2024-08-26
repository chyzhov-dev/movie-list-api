import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResource {
  @Expose()
  public id: number;
}
