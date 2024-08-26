export interface MoviesServiceCreateParams {
  title: string;
  year: number;
  userId: number;
  file?: Express.Multer.File;
}

export interface MoviesServiceUpdateParams {
  id: number;
  title?: string;
  year?: number;
  userId: number;
  file?: Express.Multer.File;
}

export interface MoviesServiceFindAllParams {
  userId: number,
  pagination: MoviesServicePagination,
}

export interface MoviesServicePagination {
  limit: number;
  page: number;
}
