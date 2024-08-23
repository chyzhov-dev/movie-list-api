import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '@modules/users/entities/user.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  year: number;

  @Column({
    nullable: true,
  })
  poster: string;

  @ManyToOne(() => User, (user) => user.movies)
  user: User;
}
