import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MovieResource {
  @Expose()
  public id: number;

  @Expose()
  public title: string;

  @Expose()
  public year: number;

  @Expose()
  public poster: string;
}
