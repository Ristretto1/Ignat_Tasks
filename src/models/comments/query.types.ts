import { SortDirection } from 'mongodb';

export interface IQueryCommentData {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
}
