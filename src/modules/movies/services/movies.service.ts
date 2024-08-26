import { createRandomString } from '@core/utils/string';
import { Movie } from '@modules/movies/entities/movie.entity';
import {
  MoviesServiceCreateParams,
  MoviesServiceFindAllParams,
  MoviesServiceUpdateParams,
} from '@modules/movies/types/services';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { DeleteResult, Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

@Injectable()
export class MoviesService {
  @InjectRepository(Movie)
  private movieRepository: Repository<Movie>;

  @Inject()
  private configService: ConfigService;

  /**
   * Getting the path to the poster file
   * @param {string} parts
   * @return {string}
   * @private
   */
  private getStoragePath(...parts: string[]): string {
    return path.join(
      path.resolve(process.cwd()),
      path.resolve(this.configService.get('STORAGE_UPLOADS', 'uploads')),
      ...(parts ?? []),
    );
  }

  /**
   * Saving the poster file
   * @param {Express.Multer.File} poster
   * @return {Promise<string>}
   * @private
   */
  private async savePoster(poster: Express.Multer.File): Promise<string> {
    const fileName = `${createRandomString()}-${poster.originalname}`;
    const filePath = this.getStoragePath(fileName);

    fs.writeFileSync(filePath, poster.buffer);

    return fileName;
  }

  /**
   * Remove the poster file
   * @param {string} poster
   * @private
   */
  private removePoster(poster: string): void {
    const filePath = this.getStoragePath(poster);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * Create a new movie entry
   * @param {Express.Multer.File} file
   * @param {MoviesServiceCreateParams} params
   * @return {Promise<Movie>}
   */
  public async create({
    file,
    ...params
  }: MoviesServiceCreateParams): Promise<Movie> {
    const payload: Partial<Movie> = {
      ...params,
    };

    if (file) {
      payload.poster = await this.savePoster(file);
    }

    return this.movieRepository.save(payload);
  }

  /**
   * Update a movie entry
   * @param {Express.Multer.File} file
   * @param {MoviesServiceUpdateParams} params
   * @return {Promise<Movie>}
   */
  public async update({
    file,
    ...params
  }: MoviesServiceUpdateParams): Promise<Movie> {
    const movie = await this.movieRepository.findOne({
      where: {
        id: params.id,
      },
    });
    let fileName: string;

    if (!movie) {
      throw new Error('Error update movie');
    }

    if (file) {
      fileName = await this.savePoster(file);

      // delete old file
      if (movie.poster) {
        this.removePoster(movie.poster);
      }
    }

    return this.movieRepository.save({
      ...movie,
      ...params,
      ...(fileName ? { poster: fileName } : {}),
    });
  }

  /**
   * Finds entities that match given find options
   * @param {MoviesServiceFindAllParams} params
   * @return {Promise<[Movie[], number]>}
   */
  public async findAll(
    params: MoviesServiceFindAllParams,
  ): Promise<[Movie[], number]> {
    const { limit, page } = params.pagination;
    const userId = params.userId;

    return this.movieRepository.findAndCount({
      where: { userId },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  /**
   * Find one entry by id
   * @param {number} id
   * @return {Promise<Movie>}
   */
  public findOne(id: number): Promise<Movie> {
    return this.movieRepository.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * Find one entry by find option
   * @param {FindOptionsWhere<Movie>[] | FindOptionsWhere<Movie>} where
   * @return {Promise<Movie>}
   */
  public findOneWhere(
    where: FindOptionsWhere<Movie>[] | FindOptionsWhere<Movie>,
  ): Promise<Movie> {
    return this.movieRepository.findOne({ where });
  }

  /**
   * Deletes entities by id
   * @param {number} id
   * @return {Promise<DeleteResult>}
   */
  public async delete(id: number): Promise<DeleteResult> {
    const movie = await this.movieRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!movie) {
      throw new Error('Error delete movie');
    }

    if (movie.poster) {
      this.removePoster(movie.poster);
    }

    return this.movieRepository.delete({ id });
  }
}
