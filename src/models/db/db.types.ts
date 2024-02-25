import { IBlogDB } from '../blogs/blogs.types';
import { IPostDB } from '../posts/posts.types';
import { IVideo } from '../videos/videos.types';

export interface IDB {
  videos: IVideo[];
  blogs: IBlogDB[];
  posts: IPostDB[];
}
