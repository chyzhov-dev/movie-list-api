import { MoviesController } from '@modules/movies/controllers/movies.controller';
import { Movie } from '@modules/movies/entities/movie.entity';
import { MoviesExistGuard } from '@modules/movies/guards/movies-exist.guard';
import { MoviesService } from '@modules/movies/services/movies.service';
import { UsersModule } from '@modules/users/users.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Movie]), JwtModule],
  controllers: [MoviesController],
  providers: [
    // services
    MoviesService,

    // guards
    MoviesExistGuard,
  ],
})
export class MoviesModule {}
