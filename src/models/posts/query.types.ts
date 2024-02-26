import { SortDirection } from 'mongodb';

export interface IQueryPostData {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: SortDirection;
}
