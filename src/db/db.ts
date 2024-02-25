import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { IBlogDB, IPostDB } from '../models/db/db.types';
dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';

const client = new MongoClient(uri);
const database = client.db('incubator');
export const blogCollection = database.collection<IBlogDB>('blogs');
export const postCollection = database.collection<IPostDB>('posts');

export const runDb = async () => {
  try {
    await client.connect();
    console.log('Client connect to DB');
    console.log(`Example app listening on port ${process.env.PORT}`);
    console.log('uri: ', uri);
  } catch (err) {
    console.log(`${err}`);
    await client.close();
  }
};
