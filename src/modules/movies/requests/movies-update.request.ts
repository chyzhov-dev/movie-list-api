import { PartialType } from '@nestjs/swagger';
import { MoviesCreateRequest } from '@modules/movies/requests/movies-create.request';

export class MoviesUpdateRequest extends PartialType(MoviesCreateRequest) {}
