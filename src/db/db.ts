import { MongoClient } from 'mongodb';
import { IBlogDB, ICommentDB, IPostDB, IUserDB } from '../models/db/db.types';
import { SETTINGS } from '../settings/settings';

const uri = SETTINGS.MONGO_URI;

const client = new MongoClient(uri);
const database = client.db();
export const blogCollection = database.collection<IBlogDB>('blogs');
export const postCollection = database.collection<IPostDB>('posts');
export const userCollection = database.collection<IUserDB>('users');
export const commentCollection = database.collection<ICommentDB>('comment');

export const runDb = async () => {
  try {
    await client.connect();
    console.log('Client connect to DB');
    console.log(`Example app listening on port ${SETTINGS.PORT}`);
    console.log('uri: ', uri);
  } catch (err) {
    console.log(`${err}`);
    await client.close();
  }
};
