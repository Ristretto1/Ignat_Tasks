import { SortDirection } from 'mongodb';

export interface IQueryUserData {
  pageNumber: number;
  pageSize: number;
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: string;
  sortDirection: SortDirection;
}
