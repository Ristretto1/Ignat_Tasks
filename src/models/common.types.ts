export enum HTTP_STATUSES {
  OK_200 = 200,
  CREATED_201 = 201,
  NO_CONTENT_204 = 204,

  BAD_REQUEST_400 = 400,
  UNAUTHORIZED_401 = 401,
  NOT_FOUND_404 = 404,
}

export enum AppRouterPath {
  testing = '/testing',
  blogs = '/blogs',
  posts = '/posts',
}

export interface IErrorMessage {
  message: string;
  field: string;
}

export interface IError {
  errorsMessages: IErrorMessage[];
}

export interface IOutputModel<I> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: I[];
}
