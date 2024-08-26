import { User } from '@modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public year: number;

  @Column()
  public userId: number;

  @Column({
    nullable: true,
  })
  public poster: string;

  @ManyToOne(() => User, (user) => user.movies)
  public user: User;
}
