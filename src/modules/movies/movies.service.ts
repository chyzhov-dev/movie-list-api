import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '@modules/movies/entities/movie.entity';
import { User } from '@modules/users/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import { createRandomString } from '@src/utils';
import { UpdateMovieDto } from '@modules/movies/dto/update-movie.dto';

interface Pagination {
  limit: number;
  page: number;
}
@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
  ) {}

  private async savePoster(poster: Express.Multer.File) {
    try {
      const rootDirectory = path.resolve(process.cwd());

      const fileName = `uploads/${createRandomString()}-${poster.originalname}`;
      const filePath = path.join(rootDirectory, fileName);

      fs.writeFileSync(filePath, poster.buffer);

      return fileName;
    } catch {
      throw new Error('Failed to save');
    }
  }

  async create(
    user: User,
    { year, title }: CreateMovieDto,
    poster?: Express.Multer.File,
  ) {
    const payload: Partial<Movie> = {
      year,
      title,
      user,
    };

    const isExist = await this.movieRepository.findOne({
      where: payload,
    });

    if (isExist) {
      throw new Error('Movie with the same title and year already exists');
    }

    if (poster) {
      try {
        payload.poster = await this.savePoster(poster);
      } catch {
        throw new Error('Failed to save poster');
      }
    }

    return this.movieRepository.save(payload);
  }

  async update(
    id: number,
    { year, title }: UpdateMovieDto,
    file?: Express.Multer.File,
  ) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
    });

    if (!movie) {
      throw new Error('Movie not found');
    }

    if (file) {
      try {
        const fileName = await this.savePoster(file);

        // delete old file
        if (movie.poster) {
          const rootDirectory = path.resolve(process.cwd());
          const oldFilePath = path.join(rootDirectory, movie.poster);

          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }

        return this.movieRepository.save({
          ...movie,
          year,
          title,
          poster: fileName,
        });
      } catch (e) {
        debugger;
        throw new Error('Failed to save');
      }
    }

    return this.movieRepository.save({
      ...movie,
      year,
      title,
    });
  }

  async findAll(user: User, pagination: Pagination) {
    const { limit, page } = pagination;
    const [result, total] = await this.movieRepository.findAndCount({
      where: { user },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: result,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  findOne(id: number) {
    return this.movieRepository.findOne({
      where: {
        id,
      },
    });
  }
}
