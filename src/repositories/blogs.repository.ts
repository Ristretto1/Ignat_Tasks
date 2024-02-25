import { ObjectId } from 'bson';
import { blogCollection } from '../db/db';
import { IBlogOutput } from '../models/blogs/output.types';
import { IBlogDB } from '../models/db/db.types';
import { blogMapper } from '../models/blogs/mapper/blogMapper';

export class BlogRepository {
  static async getAll(): Promise<IBlogOutput[]> {
    const blogs = await blogCollection.find({}).toArray();
    return blogs.map(blogMapper);
  }
  static async getItemById(id: string): Promise<IBlogOutput | null> {
    const currentItem = await blogCollection.findOne({ _id: new ObjectId(id) });
    if (!currentItem) return null;
    return blogMapper(currentItem);
  }
  static async removeItemById(id: string): Promise<boolean> {
    const res = await blogCollection.deleteOne({ _id: new ObjectId(id) });
    return !!res.deletedCount;
  }
  static async createItem(data: IBlogDB): Promise<IBlogOutput | null> {
    const res = await blogCollection.insertOne(data);
    const currentIndex = res.insertedId.toString();
    const item = await this.getItemById(currentIndex);
    return item;
  }
  static async updateItem(id: string, data: IBlogDB): Promise<boolean> {
    const res = await blogCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          description: data.description,
          name: data.name,
          websiteUrl: data.websiteUrl,
        },
      }
    );

    return !!res.matchedCount;
  }
}
