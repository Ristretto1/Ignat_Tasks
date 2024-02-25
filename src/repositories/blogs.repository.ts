import { db } from '../db/db';
import { IBlogDB } from '../models/blogs/blogs.types';
import { IBlogOutput } from '../models/blogs/output.types';

export class BlogRepository {
  static getAll(): IBlogOutput[] {
    return db.blogs;
  }
  static getItemById(id: string): IBlogOutput | undefined {
    const currentItem = db.blogs.find((el) => el.id === id);
    return currentItem;
  }
  static removeItemById(id: string): boolean {
    const currentItemIndex = db.blogs.findIndex((el) => el.id === id);
    if (currentItemIndex === -1) return false;

    db.blogs.splice(currentItemIndex, 1);
    return true;
  }
  static createItem(data: IBlogDB): IBlogDB {
    db.blogs.push(data);
    return data;
  }
  static updateItem(id: string, data: IBlogDB): boolean {
    const currentItemIndex = db.blogs.findIndex((el) => el.id === id);
    if (currentItemIndex === -1) return false;
    db.blogs[currentItemIndex] = {
      ...db.blogs[currentItemIndex],
      description: data.description,
      name: data.name,
      websiteUrl: data.websiteUrl,
    };
    return true;
  }
}
