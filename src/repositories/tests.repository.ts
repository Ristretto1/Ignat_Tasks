import { blogCollection, commentCollection, postCollection, userCollection } from '../db/db';

export class TestsRepository {
  static async clearAllDB() {
    await blogCollection.deleteMany({});
    await postCollection.deleteMany({});
    await userCollection.deleteMany({});
    await commentCollection.deleteMany({});
  }
}
