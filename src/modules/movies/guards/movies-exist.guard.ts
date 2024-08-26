import { MoviesService } from '@modules/movies/services/movies.service';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class MoviesExistGuard implements CanActivate {
  @Inject(MoviesService)
  private readonly moviesService: MoviesService;

  /**
   * Checking if a movie exists in the database
   * @param {ExecutionContext} context
   * @return {Promise<boolean>}
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const id = request?.params?.id;

    if (!id) {
      this.error();
    }

    const movie = await this.moviesService.findOne(id);

    if (!movie) {
      this.error('Movie not found', HttpStatus.NOT_FOUND);
    }

    return true;
  }

  /**
   * Throwing an error
   * @param {string} message
   * @param {HttpStatus} status
   * @protected
   */
  protected error(
    message?: string,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ): never {
    throw new HttpException(message ? message : 'Bad request', status);
  }
}
