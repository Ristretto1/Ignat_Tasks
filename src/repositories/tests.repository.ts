import { blogCollection, postCollection } from '../db/db';

export class TestsRepository {
  static async clearAllDB() {
    await blogCollection.deleteMany({});
    await postCollection.deleteMany({});
  }
}
