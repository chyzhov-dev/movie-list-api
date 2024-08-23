import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  NotFoundException,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { AuthGuard } from '@modules/auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthRequest } from '@modules/auth/request';
import { UsersService } from '@modules/users/users.service';
import { GetMoviesDto } from '@modules/movies/dto/get-movies.dto';
import { MovieEntity } from '@modules/movies/transformers/movies.transformer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateMovieDto } from "@modules/movies/dto/update-movie.dto";

@ApiTags('movies')
@ApiBearerAuth()
@Controller('movies')
@UseGuards(AuthGuard)
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateMovieDto })
  async create(
    @Req() request: AuthRequest,
    @Body() createMovieDto: CreateMovieDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user = await this.usersService.findOne(request.user.id);
    const movie = await this.moviesService.create(user, createMovieDto, file);

    return new MovieEntity(movie);
  }

  @Get()
  async findAll(@Req() request: AuthRequest, @Query() params: GetMoviesDto) {
    const user = await this.usersService.findOne(request.user.id);
    const { page = 1, perPage = 10 } = params;

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const response = await this.moviesService.findAll(user, {
      page: +page,
      limit: +perPage,
    });

    return {
      data: response.data.map((movie) => new MovieEntity(movie)),
      meta: response.meta,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateMovieDto })
  async update(
    @Param('id') id: string,
    @Req() request: AuthRequest,
    @Body() updateMovieDto: UpdateMovieDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.moviesService.update(+id, updateMovieDto, file);
  }
}
