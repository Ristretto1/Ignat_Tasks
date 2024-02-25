import { db } from '../db/db';

export class TestsRepository {
  static clearAllDB() {
    db.blogs.length = 0;
    db.videos.length = 0;
    db.posts.length = 0;
  }
}
