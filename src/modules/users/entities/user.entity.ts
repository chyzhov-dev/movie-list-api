import { Movie } from '@modules/movies/entities/movie.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public password: string;

  @OneToMany(() => Movie, (movie) => movie.user)
  public movies: Movie[];
}
