import { SortDirection } from 'mongodb';

export interface IQueryBlogData {
  pageNumber: number;
  pageSize: number;
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: SortDirection;
}
