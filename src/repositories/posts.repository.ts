import { db } from '../db/db';
import { IPostOutput } from '../models/posts/output.types';
import { IPostDB } from '../models/posts/posts.types';

export class PostsRepository {
  static getAll(): IPostDB[] {
    return db.posts;
  }
  static getItemById(id: string): IPostDB | undefined {
    const currentItem = db.posts.find((el) => el.id === id);
    return currentItem;
  }
  static removeItemById(id: string): boolean {
    const currentItemIndex = db.posts.findIndex((el) => el.id === id);
    if (currentItemIndex === -1) return false;
    db.posts.splice(currentItemIndex, 1);
    return true;
  }
  static createItem(data: IPostOutput): IPostOutput {
    db.posts.push(data);
    return data;
  }
  static updateItem(id: string, data: IPostOutput): boolean {
    const currentItemIndex = db.posts.findIndex((el) => el.id === id);
    if (currentItemIndex === -1) return false;
    db.posts[currentItemIndex] = {
      ...db.posts[currentItemIndex],
      blogId: data.blogId,
      content: data.content,
      shortDescription: data.shortDescription,
      title: data.title,
    };
    return true;
  }
}
