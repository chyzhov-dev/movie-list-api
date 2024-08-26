import { PaginationResponse } from '@core/types/response';
import { AuthGuard } from '@modules/auth/guards/auth.guard';
import { AuthRequest } from '@modules/auth/types/request';
import { MoviesExistGuard } from '@modules/movies/guards/movies-exist.guard';
import { MoviesCreateRequest } from '@modules/movies/requests/movies-create.request';
import { MoviesGetRequest } from '@modules/movies/requests/movies-get.request';
import { MoviesUpdateRequest } from '@modules/movies/requests/movies-update.request';
import { MovieResource } from '@modules/movies/resources/movie.resource';
import { MoviesService } from '@modules/movies/services/movies.service';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

@ApiTags('movies')
@ApiBearerAuth()
@Controller('movies')
@UseGuards(AuthGuard)
export class MoviesController {
  public constructor(private readonly moviesService: MoviesService) {}

  @Get()
  public async list(
    @Req() request: AuthRequest,
    @Query() query: MoviesGetRequest,
  ): Promise<{
    data: MovieResource[];
    meta: PaginationResponse;
  }> {
    const { page = 1, perPage = 8 } = query;
    const userId = request.user.id;
    const [list, total] = await this.moviesService.findAll({
      userId: userId,
      pagination: {
        page: Number(page),
        limit: Number(perPage),
      },
    });

    return {
      data: list.map((movie) => plainToClass(MovieResource, movie)),
      meta: {
        limit: perPage,
        page: page,
        total: total,
      },
    };
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: MoviesCreateRequest })
  public async create(
    @Req() request: AuthRequest,
    @Body() body: MoviesCreateRequest,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<MovieResource> {
    const userId = request.user.id;
    const isExists = await this.moviesService.findOneWhere({
      year: body.year,
      title: body.title,
      userId: userId,
    });

    if (isExists) {
      throw new Error('Movie with the same title and year already exists');
    }

    const movie = await this.moviesService.create({
      ...body,
      file: file,
      userId: userId,
    });

    return plainToClass(MovieResource, movie);
  }

  @Get(':id')
  @UseGuards(MoviesExistGuard)
  public async item(@Param('id') id: string): Promise<MovieResource> {
    const movie = await this.moviesService.findOne(Number(id));

    return plainToClass(MovieResource, movie);
  }

  @Patch(':id')
  @UseGuards(MoviesExistGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: MoviesUpdateRequest })
  public async update(
    @Param('id') id: string,
    @Body() body: MoviesUpdateRequest,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: AuthRequest,
  ): Promise<MovieResource> {
    const userId = request.user.id;

    const movie = await this.moviesService.update({
      ...body,
      id: Number(id),
      userId: userId,
      file: file,
    });

    return plainToClass(MovieResource, movie);
  }

  @Delete(':id')
  @UseGuards(MoviesExistGuard)
  public async delete(@Param('id') id: string): Promise<MovieResource> {
    const movie = await this.moviesService.findOne(Number(id));

    await this.moviesService.delete(Number(id));

    return plainToClass(MovieResource, movie);
  }
}
