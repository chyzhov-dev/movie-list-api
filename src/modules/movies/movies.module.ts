import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { UsersModule } from '@modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Movie]), JwtModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
