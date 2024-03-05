import { Request } from 'express';

export enum HTTP_STATUSES {
  OK_200 = 200,
  CREATED_201 = 201,
  NO_CONTENT_204 = 204,

  BAD_REQUEST_400 = 400,
  UNAUTHORIZED_401 = 401,
  FORBIDDEN_403 = 403,
  NOT_FOUND_404 = 404,
}

export enum AppRouterPath {
  testing = '/testing',
  blogs = '/blogs',
  posts = '/posts',
  users = '/users',
  auth = '/auth',
  comments = '/comments',
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

export type RequestWithParams<P> = Request<P, unknown, unknown, unknown>;
export type RequestWithParamsAndQuery<P, Q> = Request<P, unknown, unknown, Q>;
export type RequestWithQuery<Q> = Request<unknown, unknown, unknown, Q>;
export type RequestWithBody<B> = Request<unknown, unknown, B, unknown>;
export type RequestWithParamsAndBody<P, B> = Request<P, unknown, B, unknown>;
